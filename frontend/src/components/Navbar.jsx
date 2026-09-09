import React from "react";
import { GraduationCap, Plus, RefreshCw, Sun, Moon, TrendingUp, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
  darkMode,
  onToggleDarkMode,
  onOpenAnalytics,
  onExportCSV,
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2.5 sm:space-x-3.5"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-indigo-500 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative p-2 sm:p-2.5 bg-slate-900 border border-brand-500/30 rounded-xl text-brand-400 shadow-md flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-heading">
                  AcademyHub
                </h1>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30 rounded-full tracking-wide">
                  <Sparkles className="w-2.5 h-2.5" /> MintMesh
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                Student Management System
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-1.5 sm:space-x-2"
          >
            {/* Dark / Light Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 active:bg-slate-700 rounded-xl border border-slate-700/60 transition-all cursor-pointer shadow-sm"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300" />
              )}
            </motion.button>

            {/* Analytics */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAnalytics}
              className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 active:bg-slate-700 rounded-xl border border-slate-700/60 transition-all cursor-pointer shadow-sm"
              title="View Analytics & Insights"
              aria-label="View Analytics"
            >
              <TrendingUp className="w-4 h-4" />
            </motion.button>

            {/* Export CSV */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportCSV}
              className="hidden sm:inline-flex p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 active:bg-slate-700 rounded-xl border border-slate-700/60 transition-all cursor-pointer shadow-sm"
              title="Export all students to CSV"
              aria-label="Export CSV"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 active:bg-slate-700 rounded-xl border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh Records"
              aria-label="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-400" : ""}`}
              />
            </motion.button>

            {/* Add Student CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCreateModal}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-brand-600/30 border border-brand-400/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Add Student</span>
              <span className="xs:hidden">Add</span>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </header>
  );
}
