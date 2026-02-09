import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2, Plus, Phone, Mail, Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quoted: "bg-violet-100 text-violet-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function DashboardLeads() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Status updated" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead deleted" });
    },
  });

  const addLead = useMutation({
    mutationFn: async (lead: Partial<Lead>) => {
      const { error } = await supabase.from("leads").insert(lead);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      setAddOpen(false);
      toast({ title: "Lead created" });
    },
  });

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      if (lines.length < 2) {
        toast({ title: "Empty or invalid CSV", variant: "destructive" });
        return;
      }

      // Parse header
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));
      
      // Map common header variations
      const headerMap: Record<string, string> = {
        name: "full_name",
        fullname: "full_name",
        full_name: "full_name",
        email: "email",
        emailaddress: "email",
        phone: "phone",
        phonenumber: "phone",
        telephone: "phone",
        city: "city_state",
        citystate: "city_state",
        city_state: "city_state",
        location: "city_state",
        project: "project_type",
        projecttype: "project_type",
        project_type: "project_type",
        type: "project_type",
        timeline: "timeline",
        glasssize: "glass_size",
        glass_size: "glass_size",
        size: "glass_size",
        message: "message",
        notes: "message",
        comment: "message",
        status: "status",
        source: "source",
      };

      const mappedHeaders = headers.map(h => headerMap[h] || h);
      const leadsToInsert: Partial<Lead>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const lead: Record<string, string> = {};
        
        mappedHeaders.forEach((header, idx) => {
          if (values[idx]?.trim()) {
            lead[header] = values[idx].trim();
          }
        });

        if (lead.full_name) {
          leadsToInsert.push({
            full_name: lead.full_name,
            email: lead.email || undefined,
            phone: lead.phone || undefined,
            city_state: lead.city_state || undefined,
            project_type: lead.project_type || undefined,
            timeline: lead.timeline || undefined,
            glass_size: lead.glass_size || undefined,
            message: lead.message || undefined,
            status: (["new", "contacted", "quoted", "won", "lost"].includes(lead.status) ? lead.status : "new") as Lead["status"],
            source: "google_sheet",
          });
        }
      }

      if (leadsToInsert.length === 0) {
        toast({ title: "No valid leads found in CSV", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("leads").insert(leadsToInsert);
      if (error) throw error;

      qc.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: `Imported ${leadsToInsert.length} leads` });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to import CSV", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Parse CSV line handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search leads…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleCSVUpload}
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="h-4 w-4 mr-1" />{uploading ? "Importing…" : "Import CSV"}
        </Button>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" />Add Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
            <AddLeadForm onSubmit={(data) => addLead.mutate(data)} loading={addLead.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* CSV Format Hint */}
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="py-3 px-4 flex items-center gap-3 text-sm text-slate-600">
          <FileSpreadsheet className="h-5 w-5 text-slate-400" />
          <span>CSV columns: <code className="bg-slate-200 px-1 rounded text-xs">name, email, phone, city, project_type, timeline, glass_size, message, status</code></span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left p-3 font-medium text-slate-500">Name</th>
                    <th className="text-left p-3 font-medium text-slate-500 hidden sm:table-cell">Contact</th>
                    <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">Project</th>
                    <th className="text-left p-3 font-medium text-slate-500">Status</th>
                    <th className="text-left p-3 font-medium text-slate-500 hidden lg:table-cell">Date</th>
                    <th className="text-right p-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-b last:border-0 hover:bg-slate-50/50">
                      <td className="p-3">
                        <p className="font-medium text-slate-900">{lead.full_name}</p>
                        <p className="text-xs text-slate-400 sm:hidden">{lead.email}</p>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex flex-col gap-0.5">
                          {lead.email && <span className="text-slate-600 flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                          {lead.phone && <span className="text-slate-600 flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-slate-600 capitalize">{lead.project_type ?? "—"}</td>
                      <td className="p-3">
                        <Select value={lead.status} onValueChange={(v) => updateStatus.mutate({ id: lead.id, status: v })}>
                          <SelectTrigger className="h-7 w-auto border-0 p-0">
                            <Badge variant="secondary" className={`${STATUS_COLORS[lead.status]} capitalize`}>{lead.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedLead(lead)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => { if (confirm("Delete this lead?")) deleteLead.mutate(lead.id); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedLead?.full_name}</DialogTitle></DialogHeader>
          {selectedLead && (
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-500">Email</span><p className="font-medium">{selectedLead.email ?? "—"}</p></div>
                <div><span className="text-slate-500">Phone</span><p className="font-medium">{selectedLead.phone ?? "—"}</p></div>
                <div><span className="text-slate-500">City/State</span><p className="font-medium">{selectedLead.city_state ?? "—"}</p></div>
                <div><span className="text-slate-500">Project Type</span><p className="font-medium capitalize">{selectedLead.project_type ?? "—"}</p></div>
                <div><span className="text-slate-500">Timeline</span><p className="font-medium capitalize">{selectedLead.timeline ?? "—"}</p></div>
                <div><span className="text-slate-500">Glass Size</span><p className="font-medium">{selectedLead.glass_size ?? "—"}</p></div>
                <div><span className="text-slate-500">Source</span><p className="font-medium capitalize">{selectedLead.source ?? "—"}</p></div>
                <div><span className="text-slate-500">Status</span><Badge variant="secondary" className={`${STATUS_COLORS[selectedLead.status]} capitalize mt-1`}>{selectedLead.status}</Badge></div>
              </div>
              {selectedLead.message && (
                <div><span className="text-slate-500">Message</span><p className="font-medium bg-slate-50 rounded-lg p-3 mt-1">{selectedLead.message}</p></div>
              )}
              <p className="text-xs text-slate-400">Created: {new Date(selectedLead.created_at).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddLeadForm({ onSubmit, loading }: { onSubmit: (d: Partial<Lead>) => void; loading: boolean }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", city_state: "", project_type: "", message: "" });
  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, status: "new", source: "manual" }); }}>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Full Name *</Label><Input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><Label>City / State</Label><Input value={form.city_state} onChange={(e) => set("city_state", e.target.value)} /></div>
      </div>
      <div><Label>Project Type</Label>
        <Select value={form.project_type} onValueChange={(v) => set("project_type", v)}>
          <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating…" : "Create Lead"}</Button>
    </form>
  );
}
