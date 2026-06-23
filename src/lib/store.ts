import { create } from 'zustand';

export type View = 
  | 'home' 
  | 'services' 
  | 'order' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'dashboard-orders' 
  | 'dashboard-wallet'
  | 'admin' 
  | 'admin-services' 
  | 'admin-orders' 
  | 'admin-users' 
  | 'admin-transactions' 
  | 'admin-settings'
  | 'cookies'
  | 'privacy';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  deliveryTime: string;
  categorySlug: string;
  category?: { name: string; slug: string; icon: string };
  icon: string;
  sortOrder: number;
  active: boolean;
  fields: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId: string;
  serviceId: string;
  status: string;
  formData: string;
  notes?: string;
  adminNotes?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  user?: { id: string; name: string; email: string };
  transactions?: Transaction[];
}

interface Transaction {
  id: string;
  userId: string;
  orderId?: string;
  type: string;
  amount: number;
  status: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
  order?: { service?: { name: string } };
}

interface AppState {
  // Navigation
  view: View;
  selectedServiceId: string | null;
  selectedOrderId: string | null;
  
  // Auth
  user: User | null;
  isLoading: boolean;
  
  // Data
  services: Service[];
  orders: Order[];
  transactions: Transaction[];
  
  // Admin data
  adminOrders: Order[];
  adminUsers: any[];
  adminTransactions: Transaction[];
  adminStats: any;
  adminSettings: Record<string, string>;
  
  // Actions
  setView: (view: View) => void;
  setSelectedService: (id: string | null) => void;
  setSelectedOrder: (id: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setServices: (services: Service[]) => void;
  setOrders: (orders: Order[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setAdminOrders: (orders: Order[]) => void;
  setAdminUsers: (users: any[]) => void;
  setAdminTransactions: (transactions: Transaction[]) => void;
  setAdminStats: (stats: any) => void;
  setAdminSettings: (settings: Record<string, string>) => void;
  
  // API helpers
  fetchUser: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  fetchAdminUsers: () => Promise<void>;
  fetchAdminTransactions: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  fetchAdminSettings: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  view: 'home',
  selectedServiceId: null,
  selectedOrderId: null,
  
  // Auth
  user: null,
  isLoading: true,
  
  // Data
  services: [],
  orders: [],
  transactions: [],
  
  // Admin data
  adminOrders: [],
  adminUsers: [],
  adminTransactions: [],
  adminStats: null,
  adminSettings: {},
  
  // Actions
  setView: (view) => set({ view }),
  setSelectedService: (id) => set({ selectedServiceId: id }),
  setSelectedOrder: (id) => set({ selectedOrderId: id }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setServices: (services) => set({ services }),
  setOrders: (orders) => set({ orders }),
  setTransactions: (transactions) => set({ transactions }),
  setAdminOrders: (adminOrders) => set({ adminOrders }),
  setAdminUsers: (adminUsers) => set({ adminUsers }),
  setAdminTransactions: (adminTransactions) => set({ adminTransactions }),
  setAdminStats: (adminStats) => set({ adminStats }),
  setAdminSettings: (adminSettings) => set({ adminSettings }),
  
  // API helpers
  fetchUser: async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  
  fetchServices: async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const services = await res.json();
        set({ services });
      }
    } catch {}
  },
  
  fetchOrders: async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const orders = await res.json();
        set({ orders });
      }
    } catch {}
  },
  
  fetchTransactions: async () => {
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const transactions = await res.json();
        set({ transactions });
      }
    } catch {}
  },
  
  fetchAdminOrders: async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const adminOrders = await res.json();
        set({ adminOrders });
      }
    } catch {}
  },
  
  fetchAdminUsers: async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const adminUsers = await res.json();
        set({ adminUsers });
      }
    } catch {}
  },
  
  fetchAdminTransactions: async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      if (res.ok) {
        const adminTransactions = await res.json();
        set({ adminTransactions });
      }
    } catch {}
  },
  
  fetchAdminStats: async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const adminStats = await res.json();
        set({ adminStats });
      }
    } catch {}
  },
  
  fetchAdminSettings: async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const adminSettings = await res.json();
        set({ adminSettings });
      }
    } catch {}
  },
  
  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const user = await res.json();
        set({ user });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  
  register: async (name, email, password, phone) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (res.ok) {
        const user = await res.json();
        set({ user });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    set({ user: null, view: 'home' });
  },
}));
