import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, X, BarChart2 } from "lucide-react";

const COLORS = { active: "#10b981", graduated: "#38bdf8", dropped: "#f43f5e" };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 shadow-xl text-sm">
        <p className="font-semibold text-white capitalize">{payload[0].name ?? payload[0].dataKey}</p>
        <p className="text-slate-300">Count: <span className="text-white font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsChart({ stats, isOpen, onClose }) {
  const [tab, setTab] = useState("donut");

  const pieData = [
    { name: "Active", value: stats.active || 0 },
    { name: "Graduated", value: stats.graduated || 0 },
    { name: "Dropped", value: stats.dropped || 0 },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Active", count: stats.active || 0 },
    { name: "Graduated", count: stats.graduated || 0 },
    { name: "Dropped", count: stats.dropped || 0 },
  ];

  const total = stats.total || 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <TrendingUp className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-heading">Enrollment Analytics</h2>
                  <p className="text-xs text-slate-400">{stats.total ?? 0} total students across all statuses</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 p-4 border-b border-slate-800 bg-slate-950/40">
              {[{ id: "donut", label: "Breakdown" }, { id: "bar", label: "Comparison" }].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    tab === t.id
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Chart Body */}
            <div className="p-6">
              {pieData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No student data to display yet.</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {tab === "donut" && (
                    <motion.div key="donut" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-full sm:w-1/2 h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel}>
                                {pieData.map((entry) => (
                                  <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-3 w-full sm:w-1/2">
                          {pieData.map((entry) => {
                            const pct = ((entry.value / total) * 100).toFixed(1);
                            return (
                              <div key={entry.name} className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-2.5 border border-slate-700/40">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[entry.name.toLowerCase()] }} />
                                  <span className="text-sm text-slate-300 font-medium">{entry.name}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-bold text-white">{entry.value}</span>
                                  <span className="text-xs text-slate-500 ml-1.5">({pct}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {tab === "bar" && (
                    <motion.div key="bar" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                              {barData.map((entry) => (
                                <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
