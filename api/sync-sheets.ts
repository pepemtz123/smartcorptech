import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

// ─── ENV VARS (set in Vercel Dashboard → Settings → Environment Variables) ───
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getSheets() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_RANGE = "Leads!A:M"; // Columns A-M

// Column order in sheet:
// A: id | B: full_name | C: phone | D: email | E: city_state | F: project_type
// G: timeline | H: glass_size | I: message | J: status | K: source | L: created_at | M: updated_at

interface LeadRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city_state: string;
  project_type: string;
  timeline: string;
  glass_size: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

function leadToRow(l: LeadRow): string[] {
  return [l.id, l.full_name, l.phone ?? "", l.email ?? "", l.city_state ?? "", l.project_type ?? "", l.timeline ?? "", l.glass_size ?? "", l.message ?? "", l.status, l.source ?? "", l.created_at, l.updated_at];
}

function rowToLead(row: string[]): Partial<LeadRow> {
  const [id, full_name, phone, email, city_state, project_type, timeline, glass_size, message, status, source, created_at, updated_at] = row;
  return { id, full_name, phone, email, city_state, project_type, timeline, glass_size, message, status, source, created_at, updated_at };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple auth check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.SYNC_SECRET ?? "Martinez!123"}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sheets = getSheets();
    const direction = (req.query.direction as string) ?? "both";

    const results: { dbToSheet: number; sheetToDb: number } = { dbToSheet: 0, sheetToDb: 0 };

    // ──── 1. DB → Sheet: Push new/updated leads to sheet ────
    if (direction === "both" || direction === "db-to-sheet") {
      const { data: dbLeads, error } = await supabase.from("leads").select("*").order("created_at");
      if (error) throw error;

      // Read existing sheet data
      const sheetRes = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SHEET_RANGE });
      const sheetRows = sheetRes.data.values ?? [];
      const existingIds = new Set(sheetRows.slice(1).map((r) => r[0])); // skip header

      // Ensure header row exists
      if (sheetRows.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: "Leads!A1",
          valueInputOption: "RAW",
          requestBody: { values: [["id", "full_name", "phone", "email", "city_state", "project_type", "timeline", "glass_size", "message", "status", "source", "created_at", "updated_at"]] },
        });
      }

      // Find new leads not in sheet
      const newRows = (dbLeads ?? [])
        .filter((l: LeadRow) => !existingIds.has(l.id))
        .map((l: LeadRow) => leadToRow(l));

      if (newRows.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: SHEET_RANGE,
          valueInputOption: "RAW",
          requestBody: { values: newRows },
        });
        results.dbToSheet = newRows.length;
      }

      // Update existing rows where status changed
      for (let i = 1; i < sheetRows.length; i++) {
        const sheetLead = rowToLead(sheetRows[i]);
        const dbLead = (dbLeads ?? []).find((l: LeadRow) => l.id === sheetLead.id);
        if (dbLead && dbLead.status !== sheetLead.status) {
          // Update status in sheet (column J = col 10, 0-indexed = 9)
          await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Leads!J${i + 1}`,
            valueInputOption: "RAW",
            requestBody: { values: [[dbLead.status]] },
          });
        }
      }
    }

    // ──── 2. Sheet → DB: Pull changes from sheet to DB ────
    if (direction === "both" || direction === "sheet-to-db") {
      const sheetRes = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SHEET_RANGE });
      const sheetRows = sheetRes.data.values ?? [];

      const { data: dbLeads } = await supabase.from("leads").select("id, status");
      const dbMap = new Map((dbLeads ?? []).map((l: { id: string; status: string }) => [l.id, l.status]));

      for (let i = 1; i < sheetRows.length; i++) {
        const row = rowToLead(sheetRows[i]);
        if (!row.id || !row.full_name) continue;

        if (!dbMap.has(row.id)) {
          // New lead from sheet → insert into DB
          const { error } = await supabase.from("leads").insert({
            id: row.id,
            full_name: row.full_name,
            phone: row.phone || null,
            email: row.email || null,
            city_state: row.city_state || null,
            project_type: row.project_type || null,
            timeline: row.timeline || null,
            glass_size: row.glass_size || null,
            message: row.message || null,
            status: row.status || "new",
            source: "google_sheet",
            google_sheet_row_id: i + 1,
          });
          if (!error) results.sheetToDb++;
        } else {
          // Existing lead — sync status from sheet if changed
          if (row.status && row.status !== dbMap.get(row.id)) {
            await supabase.from("leads").update({ status: row.status }).eq("id", row.id);
          }
        }
      }
    }

    return res.status(200).json({ ok: true, ...results });
  } catch (err: any) {
    console.error("Sync error:", err);
    return res.status(500).json({ error: err.message });
  }
}
