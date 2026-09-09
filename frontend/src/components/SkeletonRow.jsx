import React from "react";

export default function SkeletonRow({ count = 5, isCardView = false }) {
  if (isCardView) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-800 rounded"></div>
                  <div className="h-3 w-16 bg-slate-800/60 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="h-3.5 w-44 bg-slate-800/70 rounded"></div>
              <div className="h-3.5 w-32 bg-slate-800/70 rounded"></div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800/60">
              <div className="h-8 w-20 bg-slate-800 rounded-xl"></div>
              <div className="h-8 w-20 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={idx} className="border-b border-slate-800/60 animate-pulse">
          <td className="py-4 px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded"></div>
                <div className="h-3 w-16 bg-slate-800/60 rounded"></div>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="h-4 w-40 bg-slate-800 rounded"></div>
          </td>
          <td className="py-4 px-6">
            <div className="h-4 w-24 bg-slate-800 rounded"></div>
          </td>
          <td className="py-4 px-6">
            <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
          </td>
          <td className="py-4 px-6 text-right">
            <div className="flex items-center justify-end space-x-2">
              <div className="w-8 h-8 bg-slate-800 rounded-xl"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-xl"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
