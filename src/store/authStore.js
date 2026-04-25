import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  studentSignup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.studentSignup(data);
      const mockUser = {
        id: crypto.randomUUID(),
        studentId: data.studentId,
        fullName: data.fullName,
        email: data.email,
        course: data.course,
        completionYear: data.completionYear,
        role: 'student',
      };
      const mockToken = 'mock_student_token_' + Date.now();
      localStorage.setItem('vigyaan_token', mockToken);
      localStorage.setItem('vigyaan_user', JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message || 'Signup failed', isLoading: false });
      return { success: false, error: error.message };
    }
  },

  studentLogin: async (qrData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.studentLogin({ qrData });
      const mockUser = {
        id: crypto.randomUUID(),
        studentId: 'STU2024001',
        fullName: 'Arjun Sharma',
        email: 'arjun@geu.ac.in',
        course: 'B.Tech CSE',
        completionYear: '2026',
        role: 'student',
      };
      const mockToken = 'mock_student_token_' + Date.now();
      localStorage.setItem('vigyaan_token', mockToken);
      localStorage.setItem('vigyaan_user', JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message || 'Login failed', isLoading: false });
      return { success: false, error: error.message };
    }
  },

  adminSignup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const mockUser = {
        id: crypto.randomUUID(),
        staffId: data.staffId,
        fullName: data.fullName,
        department: data.department,
        role: 'admin',
      };
      const mockToken = 'mock_admin_token_' + Date.now();
      localStorage.setItem('vigyaan_token', mockToken);
      localStorage.setItem('vigyaan_user', JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message || 'Signup failed', isLoading: false });
      return { success: false, error: error.message };
    }
  },

  adminLogin: async (qrData) => {
    set({ isLoading: true, error: null });
    try {
      const mockUser = {
        id: crypto.randomUUID(),
        staffId: 'ADM2024001',
        fullName: 'Dr. Priya Verma',
        department: 'Library Sciences',
        role: 'admin',
      };
      const mockToken = 'mock_admin_token_' + Date.now();
      localStorage.setItem('vigyaan_token', mockToken);
      localStorage.setItem('vigyaan_user', JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message || 'Login failed', isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('vigyaan_token');
    localStorage.removeItem('vigyaan_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('vigyaan_token');
    const userStr = localStorage.getItem('vigyaan_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;
