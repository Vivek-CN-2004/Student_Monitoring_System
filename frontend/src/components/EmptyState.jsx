import React from 'react';
import { UserSearch, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ hasFilters, onResetFilters, onOpenCreateModal }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="py-16 px-6 text-center"
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-xl">
        <UserSearch className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-lg font-semibold text-white font-heading">
        {hasFilters ? 'No matching students found' : 'No students registered yet'}
      </h3>
      <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
        {hasFilters
          ? 'Try adjusting your search criteria or clearing the status filter.'
          : 'Get started by creating your first student record in the management portal.'}
      </p>

      <div className="mt-6 flex items-center justify-center space-x-3">
        {hasFilters ? (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Student</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
