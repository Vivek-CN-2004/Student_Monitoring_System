import React from "react";
import { Users, UserCheck, Award, UserX, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ stats = {}, activeFilter = "", onFilterChange }) {
  const safeStats = stats || {};

  const cards = [
    {
      id: "",
      title: "Total Students",
      subtitle: "All enrolled records",
      count: safeStats.total || 0,
      icon: Users,
      gradient: "from-indigo-600/20 to-brand-500/10",
      accent: "text-brand-400",
      borderActive: "border-brand-500 shadow-brand-500/20 ring-brand-500",
      iconBg: "bg-brand-500/15 border-brand-500/30 text-brand-300",
    },
    {
      id: "active",
      title: "Active Status",
      subtitle: "Currently attending",
      count: safeStats.active || 0,
      icon: UserCheck,
      gradient: "from-emerald-600/20 to-teal-500/10",
      accent: "text-emerald-400",
      borderActive: "border-emerald-500 shadow-emerald-500/20 ring-emerald-500",
      iconBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    },
    {
      id: "graduated",
      title: "Graduated",
      subtitle: "Successfully completed",
      count: safeStats.graduated || 0,
      icon: Award,
      gradient: "from-sky-600/20 to-blue-500/10",
      accent: "text-sky-400",
      borderActive: "border-sky-500 shadow-sky-500/20 ring-sky-500",
      iconBg: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    },
    {
      id: "dropped",
      title: "Dropped",
      subtitle: "Withdrawn or inactive",
      count: safeStats.dropped || 0,
      icon: UserX,
      gradient: "from-rose-600/20 to-pink-500/10",
      accent: "text-rose-400",
      borderActive: "border-rose-500 shadow-rose-500/20 ring-rose-500",
      iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange && onFilterChange(card.id)}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            className={`relative overflow-hidden cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-300 group ${
              isActive
                ? `bg-slate-900/95 ${card.borderActive} shadow-lg ring-1`
                : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700/90 hover:bg-slate-900"
            }`}
          >
            {/* Subtle background gradient glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`p-2 sm:p-2.5 rounded-xl border ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  {card.count}
                </h3>
                {isActive && (
                  <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white flex items-center gap-1">
                    Filtered <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-1 hidden sm:block truncate">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
