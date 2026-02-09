import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Lead, FollowUp } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardFollowUps() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");

  const { data: followUps = [] } = useQuery<(FollowUp & { lead?: Lead })[]>({
    queryKey: ["follow-ups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follow_ups")
        .select("*, lead:leads(*)")
        .order("follow_up_date", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((fu: any) => ({ ...fu, lead: fu.lead || undefined }));
    },
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleComplete = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("follow_ups").update({ completed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follow-ups"] }),
  });

  const deleteFollowUp = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("follow_ups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["follow-ups"] });
      toast({ title: "Follow-up deleted" });
    },
  });

  const addFollowUp = useMutation({
    mutationFn: async (fu: { lead_id: string; note: string; follow_up_date: string }) => {
      const { error } = await supabase.from("follow_ups").insert({ ...fu, completed: false });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["follow-ups"] });
      setAddOpen(false);
      toast({ title: "Follow-up scheduled" });
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const filtered = followUps.filter((fu) => {
    if (filter === "completed") return fu.completed;
    if (filter === "pending") return !fu.completed;
    if (filter === "overdue") return !fu.completed && fu.follow_up_date < today;
    return true;
  });

  const overdue = followUps.filter((fu) => !fu.completed && fu.follow_up_date < today).length;
  const pending = followUps.filter((fu) => !fu.completed).length;
  const completed = followUps.filter((fu) => fu.completed).length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("all")}>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-blue-500" />
            <div><p className="text-xs text-slate-500">Total</p><p className="text-xl font-bold">{followUps.length}</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("pending")}>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-500" />
            <div><p className="text-xs text-slate-500">Pending</p><p className="text-xl font-bold">{pending}</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("overdue")}>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div><p className="text-xs text-slate-500">Overdue</p><p className="text-xl font-bold">{overdue}</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("completed")}>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <div><p className="text-xs text-slate-500">Completed</p><p className="text-xl font-bold">{completed}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">{filter}</Badge>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Schedule Follow-up</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule Follow-up</DialogTitle></DialogHeader>
            <AddFollowUpForm leads={leads} onSubmit={(d) => addFollowUp.mutate(d)} loading={addFollowUp.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-slate-500">No follow-ups found.</CardContent></Card>
        ) : (
          filtered.map((fu) => {
            const isOverdue = !fu.completed && fu.follow_up_date < today;
            return (
              <Card key={fu.id} className={`transition-colors ${fu.completed ? "opacity-60" : ""} ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={fu.completed}
                      onCheckedChange={(checked) => toggleComplete.mutate({ id: fu.id, completed: !!checked })}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium ${fu.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                        {fu.lead?.full_name ?? "Unknown Lead"}
                      </p>
                      {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                      {fu.completed && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Done</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{fu.note}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(fu.follow_up_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 shrink-0" onClick={() => { if (confirm("Delete this follow-up?")) deleteFollowUp.mutate(fu.id); }}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function AddFollowUpForm({ leads, onSubmit, loading }: { leads: Lead[]; onSubmit: (d: { lead_id: string; note: string; follow_up_date: string }) => void; loading: boolean }) {
  const [form, setForm] = useState({ lead_id: "", note: "", follow_up_date: "" });

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div>
        <Label>Lead *</Label>
        <Select value={form.lead_id} onValueChange={(v) => setForm((p) => ({ ...p, lead_id: v }))}>
          <SelectTrigger><SelectValue placeholder="Select a lead…" /></SelectTrigger>
          <SelectContent>
            {leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.full_name} — {l.email}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Follow-up Date *</Label>
        <Input type="date" required value={form.follow_up_date} onChange={(e) => setForm((p) => ({ ...p, follow_up_date: e.target.value }))} />
      </div>
      <div>
        <Label>Note *</Label>
        <Textarea required value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="What needs to be done…" />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !form.lead_id}>{loading ? "Scheduling…" : "Schedule"}</Button>
    </form>
  );
}
