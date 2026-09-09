import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentFormModal({
  isOpen,
  mode = "create",
  student = null,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    enrollment_status: "active",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (student && mode === "edit") {
      setFormData({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        date_of_birth: student.date_of_birth || "",
        enrollment_status: student.enrollment_status || "active",
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        enrollment_status: "active",
      });
    }
    setErrors({});
    setServerError(null);
  }, [student, mode, isOpen]);

  if (!isOpen) return null;

  // Real-time client-side validator
  const validateForm = () => {
    const errs = {};

    if (!formData.first_name.trim()) {
      errs.first_name = "First name is required.";
    }

    if (!formData.last_name.trim()) {
      errs.last_name = "Last name is required.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email format (e.g. name@domain.com).";
    }

    if (!formData.date_of_birth) {
      errs.date_of_birth = "Date of birth is required.";
    } else {
      const selected = new Date(formData.date_of_birth);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        errs.date_of_birth = "Date of birth cannot be in the future.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    if (isNaN(diff) || diff < 0) return null;
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    const result = await onSubmit({
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
    });

    if (!result.success && result.error) {
      if (result.error.fieldErrors && Object.keys(result.error.fieldErrors).length > 0) {
        setErrors(result.error.fieldErrors);
      }
      setServerError(result.error.message || "Failed to save student record.");
    }
  };

  const calculatedAge = calculateAge(formData.date_of_birth);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.35 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 z-10 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl text-white shadow-md shadow-brand-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  {mode === "edit" ? "Edit Student Profile" : "Register New Student"}
                </h3>
                <p className="text-xs text-slate-400">
                  {mode === "edit"
                    ? `Updating student record #${student?.id}`
                    : "Fill in the details below to add a student"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-rose-300"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <strong className="block font-semibold">Validation / Server Notice</strong>
                <span>{serverError}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  First Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    placeholder="e.g. John"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.first_name
                        ? "border-rose-500 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
                    }`}
                  />
                </div>
                {errors.first_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.first_name}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Last Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    placeholder="e.g. Doe"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.last_name
                        ? "border-rose-500 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
                    }`}
                  />
                </div>
                {errors.last_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.last_name}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="student.name@university.edu"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : "border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </motion.p>
              )}
            </div>

            {/* Date of Birth & Enrollment Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  {calculatedAge !== null && (
                    <span className="text-[10px] font-medium text-brand-400">
                      Age: {calculatedAge} yrs
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 transition-all [color-scheme:dark] ${
                      errors.date_of_birth
                        ? "border-rose-500 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
                    }`}
                  />
                </div>
                {errors.date_of_birth && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.date_of_birth}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enrollment Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.enrollment_status}
                  onChange={(e) => handleChange("enrollment_status", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                >
                  <option value="active">Active (Enrolled)</option>
                  <option value="graduated">Graduated (Completed)</option>
                  <option value="dropped">Dropped (Withdrawn)</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 border border-brand-400/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{mode === "edit" ? "Update Profile" : "Register Student"}</span>
                  </>
                )}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
