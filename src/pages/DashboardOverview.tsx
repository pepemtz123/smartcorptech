import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Lead } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Trophy, PhoneCall, CalendarClock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  quoted: "#8b5cf6",
  won: "#22c55e",
  lost: "#ef4444",
};

export default function DashboardOverview() {
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    quoted: leads.filter((l) => l.status === "quoted").length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  const pieData = (["new", "contacted", "quoted", "won", "lost"] as const).map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: counts[s],
  }));

  // Leads per month (last 6 months)
  const monthlyData = (() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[key] = 0;
    }
    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  })();

  const summaryCards = [
    { title: "Total Leads", value: counts.total, icon: Users, color: "text-blue-600" },
    { title: "New", value: counts.new, icon: UserPlus, color: "text-blue-500" },
    { title: "Contacted", value: counts.contacted, icon: PhoneCall, color: "text-amber-500" },
    { title: "Quoted", value: counts.quoted, icon: CalendarClock, color: "text-violet-500" },
    { title: "Won", value: counts.won, icon: Trophy, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{c.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{c.value}</p>
                </div>
                <c.icon className={`h-8 w-8 ${c.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Leads by Month</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lead Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()] ?? "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Leads</CardTitle></CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-slate-500 text-sm">No leads yet. Leads submitted via the quote form will appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-slate-500">Name</th>
                    <th className="pb-2 font-medium text-slate-500">Email</th>
                    <th className="pb-2 font-medium text-slate-500">Status</th>
                    <th className="pb-2 font-medium text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 10).map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="py-2 font-medium text-slate-900">{l.full_name}</td>
                      <td className="py-2 text-slate-600">{l.email}</td>
                      <td className="py-2"><span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: `${STATUS_COLORS[l.status]}20`, color: STATUS_COLORS[l.status] }}>{l.status}</span></td>
                      <td className="py-2 text-slate-500">{new Date(l.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
