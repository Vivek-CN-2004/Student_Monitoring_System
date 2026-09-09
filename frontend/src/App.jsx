import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import StudentTable from "./components/StudentTable";
import StudentFormModal from "./components/StudentFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import AnalyticsChart from "./components/AnalyticsChart";
import Toast from "./components/Toast";
import StudentService from "./services/api";

// CSV Download Helper
const downloadCSV = (students) => {
  if (!students || students.length === 0) return;
  const headers = ["ID", "First Name", "Last Name", "Email", "Date of Birth", "Enrollment Status", "Created At"];
  const rows = students.map((s) => [
    s.id,
    `"${(s.first_name || "").replace(/"/g, '""')}"`,
    `"${(s.last_name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    s.date_of_birth,
    s.enrollment_status,
    s.created_at,
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function App() {
  // -- Dark / Light Mode ------------------------------------------------------
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved !== null ? saved === "dark" : true; // default: dark
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (darkMode) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
      }
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
  }, [darkMode]);

  // -- Students & Pagination State --------------------------------------------
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [stats, setStats] = useState({ total: 0, active: 0, graduated: 0, dropped: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // -- Modals -----------------------------------------------------------------
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // -- Toast ------------------------------------------------------------------
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // -- Debounce search input (300ms) ------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // -- Fetch Stats asynchronously ---------------------------------------------
  const fetchStats = async () => {
    try {
      const [allRes, activeRes, gradRes, dropRes] = await Promise.all([
        StudentService.getStudents({ limit: 1 }),
        StudentService.getStudents({ limit: 1, enrollmentStatus: "active" }),
        StudentService.getStudents({ limit: 1, enrollmentStatus: "graduated" }),
        StudentService.getStudents({ limit: 1, enrollmentStatus: "dropped" }),
      ]);
      setStats({
        total: allRes.success ? allRes.data.total : 0,
        active: activeRes.success ? activeRes.data.total : 0,
        graduated: gradRes.success ? gradRes.data.total : 0,
        dropped: dropRes.success ? dropRes.data.total : 0,
      });
    } catch (e) {
      console.error("Failed to fetch stats", e);
    }
  };

  // -- Fetch Students from REST API -------------------------------------------
  const fetchStudentsData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setIsLoading(true);
      setIsRefreshing(true);
      try {
        const res = await StudentService.getStudents({
          page: pagination.page,
          limit: pagination.limit,
          enrollmentStatus: statusFilter,
          search: debouncedSearch,
        });
        if (res.success && res.data) {
          setStudents(res.data.items || []);
          setPagination({
            page: res.data.page || 1,
            limit: res.data.limit || 10,
            total: res.data.total || 0,
            total_pages: res.data.total_pages || 1,
          });
        } else if (res.error) {
          showToast(res.error.message || "Failed to load students", "error");
        }
      } catch (err) {
        showToast("Unable to reach backend server.", "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pagination.page, pagination.limit, statusFilter, debouncedSearch]
  );

  useEffect(() => {
    fetchStudentsData();
    fetchStats();
  }, [fetchStudentsData]);

  // -- CSV Export (Paginates cleanly within backend limit) ---------------------
  const handleExportCSV = async () => {
    showToast("Preparing CSV export...", "info");
    try {
      let allStudents = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const res = await StudentService.getStudents({
          page: currentPage,
          limit: 100, // Valid within FastAPI backend max limit (100)
          enrollmentStatus: statusFilter,
          search: debouncedSearch,
        });

        if (res.success && res.data?.items) {
          allStudents = [...allStudents, ...res.data.items];
          totalPages = res.data.total_pages || 1;
          currentPage++;
        } else {
          showToast("Export failed: " + (res.error?.message || "error"), "error");
          return;
        }
      } while (currentPage <= totalPages);

      if (allStudents.length > 0) {
        downloadCSV(allStudents);
        showToast(`Exported ${allStudents.length} student record(s) to CSV.`, "success");
      } else {
        showToast("No student records to export.", "warning");
      }
    } catch (e) {
      showToast("Export failed: " + e.message, "error");
    }
  };

  // -- Modal Open Handlers ----------------------------------------------------
  const handleOpenCreateModal = () => {
    setSelectedStudent(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  // -- Create / Update Student Handlers ---------------------------------------
  const handleSaveStudent = async (formData) => {
    setIsSubmitting(true);
    const res =
      formMode === "edit" && selectedStudent
        ? await StudentService.updateStudent(selectedStudent.id, formData)
        : await StudentService.createStudent(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsFormModalOpen(false);
      showToast(
        formMode === "edit"
          ? `Profile for ${res.data.first_name} ${res.data.last_name} updated successfully.`
          : `${res.data.first_name} ${res.data.last_name} enrolled successfully.`,
        "success"
      );
      fetchStudentsData(true);
      fetchStats();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // -- Delete Student Handler -------------------------------------------------
  const handleDeleteConfirm = async (studentId) => {
    setIsDeleting(true);
    const res = await StudentService.deleteStudent(studentId);
    setIsDeleting(false);

    if (res.success) {
      setIsDeleteModalOpen(false);
      showToast("Student record removed successfully.", "success");
      fetchStudentsData(true);
      fetchStats();
    } else {
      showToast(res.error?.message || "Failed to delete student", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Header / Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={() => fetchStudentsData(true)}
        isRefreshing={isRefreshing}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Metric Cards / Quick Filter */}
        <StatsCards
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={(f) => {
            setStatusFilter(f);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        {/* Responsive Student Views (Cards on Mobile / Table on Desktop) */}
        <StudentTable
          students={students}
          pagination={pagination}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => {
            setStatusFilter(s);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          onEditStudent={handleOpenEditModal}
          onDeleteStudent={handleOpenDeleteModal}
          onOpenCreateModal={handleOpenCreateModal}
        />
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-5 z-40 sm:hidden">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleOpenCreateModal}
          className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-full shadow-2xl shadow-brand-500/50 flex items-center justify-center text-white border-2 border-brand-400/40 cursor-pointer"
          title="Add New Student"
          aria-label="Add New Student"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900/90 py-6 text-center text-xs text-slate-500">
        <p>
          AcademyHub &bull; Student Management System &copy; 2026 MintMesh Take-Home Assessment.
        </p>
      </footer>

      {/* Modals & Overlay Alerts */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        student={selectedStudent}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveStudent}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={selectedStudent}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <AnalyticsChart
        stats={stats}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
