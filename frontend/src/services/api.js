import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper to format backend error response into a clean structure
export const formatApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    let message = data?.detail || "An unexpected server error occurred.";
    let validationErrors = {};

    if (status === 400 && data?.errors) {
      data.errors.forEach((err) => {
        validationErrors[err.field] = err.message;
      });
      message = "Please fix the highlighted errors before submitting.";
    }

    return {
      status,
      message,
      validationErrors,
      fieldErrors: validationErrors,
      raw: data,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: "Unable to connect to backend server. Please verify backend is running on port 8000.",
      validationErrors: {},
      fieldErrors: {},
    };
  } else {
    return {
      status: -1,
      message: error.message || "An unknown network error occurred.",
      validationErrors: {},
      fieldErrors: {},
    };
  }
};

export const StudentService = {
  async getStudents({ page = 1, limit = 10, enrollmentStatus = "", search = "" } = {}) {
    try {
      const params = { page, limit };
      if (enrollmentStatus) params.enrollment_status = enrollmentStatus;
      if (search) params.search = search;

      const response = await apiClient.get("/students", { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: formatApiError(error) };
    }
  },

  async getStudentById(id) {
    try {
      const response = await apiClient.get(`/students/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: formatApiError(error) };
    }
  },

  async createStudent(studentData) {
    try {
      const response = await apiClient.post("/students", studentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: formatApiError(error) };
    }
  },

  async updateStudent(id, studentData) {
    try {
      const response = await apiClient.put(`/students/${id}`, studentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: formatApiError(error) };
    }
  },

  async deleteStudent(id) {
    try {
      const response = await apiClient.delete(`/students/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: formatApiError(error) };
    }
  },
};

export default StudentService;
