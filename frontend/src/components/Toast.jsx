import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeStyles = {
    success: {
      border: "border-emerald-500/40 shadow-emerald-500/10",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      progressBg: "bg-emerald-500",
    },
    error: {
      border: "border-rose-500/40 shadow-rose-500/10",
      icon: XCircle,
      iconColor: "text-rose-400",
      progressBg: "bg-rose-500",
    },
    warning: {
      border: "border-amber-500/40 shadow-amber-500/10",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      progressBg: "bg-amber-500",
    },
    info: {
      border: "border-brand-500/40 shadow-brand-500/10",
      icon: Info,
      iconColor: "text-brand-400",
      progressBg: "bg-brand-500",
    },
  };

  const style = typeStyles[toast.type] || typeStyles.info;
  const Icon = style.icon;

  return (
    <div className="fixed top-5 sm:top-auto sm:bottom-5 inset-x-4 sm:inset-x-auto sm:right-5 z-50 pointer-events-none flex justify-center sm:justify-end">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
          className={`pointer-events-auto relative overflow-hidden flex items-center space-x-3 p-3.5 sm:p-4 rounded-2xl border bg-slate-900/95 shadow-2xl backdrop-blur-xl ${style.border} w-full max-w-sm sm:max-w-md`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${style.iconColor}`} />
          <div className="flex-1 text-xs sm:text-sm font-medium text-slate-100">
            {toast.message}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated dismissal bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-0.5 ${style.progressBg} opacity-60`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
