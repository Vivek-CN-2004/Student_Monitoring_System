import React, { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Calendar,
  Mail,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Award,
  UserX,
  LayoutGrid,
  List,
  X,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonRow from "./SkeletonRow";
import EmptyState from "./EmptyState";

const statusBadges = {
  active: {
    label: "Active",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
    pulse: true,
    icon: UserCheck,
  },
  graduated: {
    label: "Graduated",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    dot: "bg-sky-400",
    pulse: false,
    icon: Award,
  },
  dropped: {
    label: "Dropped",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
    pulse: false,
    icon: UserX,
  },
};

const filterTabs = [
  { id: "", label: "All Students" },
  { id: "active", label: "Active" },
  { id: "graduated", label: "Graduated" },
  { id: "dropped", label: "Dropped" },
];

export default function StudentTable({
  students = [],
  pagination = { page: 1, limit: 10, total: 0, total_pages: 1 },
  isLoading = false,
  searchQuery = "",
  onSearchChange = () => {},
  statusFilter = "",
  onStatusFilterChange = () => {},
  onPageChange = () => {},
  onEditStudent = () => {},
  onDeleteStudent = () => {},
  onOpenCreateModal = () => {},
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState("auto"); // "auto", "table", "grid"

  const safeStudents = Array.isArray(students) ? students : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const parts = String(dateStr).split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        if (!isNaN(year) && !isNaN(monthIndex) && !isNaN(day) && monthNames[monthIndex]) {
          return `${monthNames[monthIndex]} ${day}, ${year}`;
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    try {
      const diff = Date.now() - new Date(dob).getTime();
      const ageDate = new Date(diff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return isNaN(age) || age < 0 || age > 130 ? null : age;
    } catch {
      return null;
    }
  };

  const copyToClipboard = (text, id) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const hasFilters = Boolean(searchQuery || statusFilter);

  // Avatar gradient generator based on name
  const getAvatarGradient = (first = "", last = "") => {
    const charCode = (first.charCodeAt(0) || 0) + (last.charCodeAt(0) || 0);
    const gradients = [
      "from-brand-600 to-indigo-500",
      "from-purple-600 to-pink-500",
      "from-teal-600 to-emerald-500",
      "from-blue-600 to-cyan-500",
      "from-amber-600 to-orange-500",
    ];
    return gradients[charCode % gradients.length];
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      
      {/* Top Controls Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl">
            {filterTabs.map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-lg shadow-md shadow-brand-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle (Grid / List) */}
          <div className="hidden sm:flex items-center space-x-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table" || viewMode === "auto"
                  ? "bg-slate-800 text-brand-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-800 text-brand-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-0 sm:p-0">
        
        {/* Loading Skeletons */}
        {isLoading && (
          viewMode === "grid" ? (
            <div className="p-4 sm:p-6">
              <SkeletonRow count={pagination.limit || 6} isCardView={true} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <tbody className="divide-y divide-slate-800/60">
                  <SkeletonRow count={pagination.limit || 5} />
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Empty State */}
        {!isLoading && safeStudents.length === 0 && (
          <div className="py-12">
            <EmptyState
              hasFilters={hasFilters}
              onResetFilters={() => {
                onSearchChange("");
                onStatusFilterChange("");
              }}
              onOpenCreateModal={onOpenCreateModal}
            />
          </div>
        )}

        {/* Loaded Data View */}
        {!isLoading && safeStudents.length > 0 && (
          <>
            {/* 1. MOBILE RESPONSIVE CARDS VIEW */}
            <div className={`${viewMode === "table" ? "hidden" : "block md:hidden"} ${viewMode === "grid" ? "!block" : ""} p-3.5 sm:p-5`}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {safeStudents.map((student) => {
                    const badge = statusBadges[student.enrollment_status] || statusBadges.active;
                    const StatusIcon = badge.icon;
                    const age = calculateAge(student.date_of_birth);

                    return (
                      <motion.div
                        key={student.id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700/80 shadow-md flex flex-col justify-between space-y-4 group transition-all"
                      >
                        {/* Header: Avatar, Name, ID & Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                                student.first_name,
                                student.last_name
                              )} flex items-center justify-center text-white text-sm font-bold shadow-md uppercase`}
                            >
                              {(student.first_name || "?")[0]}
                              {(student.last_name || "?")[0]}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm sm:text-base font-heading">
                                {student.first_name} {student.last_name}
                              </h4>
                              <span className="text-[11px] text-slate-500 font-mono">
                                ID: #{student.id}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${badge.pulse ? "animate-pulse" : ""}`} />
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {/* Details: Email and DOB */}
                        <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                          <div className="flex items-center justify-between group/email">
                            <div className="flex items-center space-x-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{student.email}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(student.email, student.id)}
                              className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
                              title="Copy email"
                            >
                              {copiedId === student.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span>{formatDate(student.date_of_birth)}</span>
                            </div>
                            {age && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {age} yrs
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEditStudent(student)}
                            className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-slate-300 hover:text-brand-300 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student)}
                            className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* 2. DESKTOP TABLE VIEW */}
            <div className={`${viewMode === "grid" ? "hidden" : "hidden md:block"} overflow-x-auto`}>
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Student</th>
                    <th className="py-4 px-6 font-semibold">Email Address</th>
                    <th className="py-4 px-6 font-semibold">Date of Birth</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <AnimatePresence mode="popLayout">
                    {safeStudents.map((student, idx) => {
                      const badge = statusBadges[student.enrollment_status] || statusBadges.active;
                      const StatusIcon = badge.icon;
                      const age = calculateAge(student.date_of_birth);

                      return (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2, delay: idx * 0.02 }}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Name & Avatar */}
                          <td className="py-4 px-6 font-medium text-white whitespace-nowrap">
                            <div className="flex items-center space-x-3.5">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                                  student.first_name,
                                  student.last_name
                                )} flex items-center justify-center text-white text-xs font-bold shadow-md uppercase group-hover:scale-105 transition-transform`}
                              >
                                {(student.first_name || "?")[0]}
                                {(student.last_name || "?")[0]}
                              </div>
                              <div>
                                <span className="block font-bold text-white font-heading">
                                  {student.first_name} {student.last_name}
                                </span>
                                <span className="block text-[11px] text-slate-500 font-mono">
                                  ID: #{student.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-6 text-slate-300 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-mono text-xs">{student.email}</span>
                              <button
                                onClick={() => copyToClipboard(student.email, student.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 rounded transition-all"
                                title="Copy email"
                              >
                                {copiedId === student.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* DOB */}
                          <td className="py-4 px-6 text-slate-300 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>{formatDate(student.date_of_birth)}</span>
                              {age !== null && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ({age}y)
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${badge.dot} ${
                                  badge.pulse ? "animate-pulse" : ""
                                }`}
                              />
                              <span>{badge.label}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEditStudent(student)}
                                className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                                title="Edit Student Profile"
                              >
                                <Pencil className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDeleteStudent(student)}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                                title="Delete Student Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>

      {/* Pagination Footer */}
      {!isLoading && safeStudents.length > 0 && (
        <div className="p-4 sm:px-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-slate-950/60">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Showing{" "}
            <strong className="text-white">
              {(pagination.page - 1) * pagination.limit + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total || safeStudents.length)}
            </strong>{" "}
            of <strong className="text-white">{pagination.total || safeStudents.length}</strong> registered students
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/80 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            <span className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl">
              {pagination.page} / {pagination.total_pages || 1}
            </span>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= (pagination.total_pages || 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/80 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Next Page"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
