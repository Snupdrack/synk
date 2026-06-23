'use client';

import { useEffect } from 'react';
import { useStore, View } from '@/lib/store';
import { DaxLayout } from '@/components/dax/layout';
import { HomeView } from '@/components/dax/home';
import { ServicesView } from '@/components/dax/services';
import { OrderFormView } from '@/components/dax/order-form';
import { LoginView } from '@/components/dax/auth/login';
import { RegisterView } from '@/components/dax/auth/register';
import { DashboardView } from '@/components/dax/dashboard';
import { DashboardOrders } from '@/components/dax/dashboard-orders';
import { DashboardWallet } from '@/components/dax/dashboard-wallet';
import { AdminView } from '@/components/dax/admin';
import { AdminServices } from '@/components/dax/admin-services';
import { AdminOrders } from '@/components/dax/admin-orders';
import { AdminUsers } from '@/components/dax/admin-users';
import { AdminTransactions } from '@/components/dax/admin-transactions';
import { AdminSettings } from '@/components/dax/admin-settings';
import { CookiesView } from '@/components/dax/cookies-view';
import { PrivacyView } from '@/components/dax/privacy-view';

function ViewRouter({ view }: { view: View }) {
  switch (view) {
    case 'home':
      return <HomeView />;
    case 'services':
      return <ServicesView />;
    case 'order':
      return <OrderFormView />;
    case 'login':
      return <LoginView />;
    case 'register':
      return <RegisterView />;
    case 'dashboard':
      return <DashboardView />;
    case 'dashboard-orders':
      return <DashboardOrders />;
    case 'dashboard-wallet':
      return <DashboardWallet />;
    case 'admin':
      return <AdminView />;
    case 'admin-services':
      return <AdminServices />;
    case 'admin-orders':
      return <AdminOrders />;
    case 'admin-users':
      return <AdminUsers />;
    case 'admin-transactions':
      return <AdminTransactions />;
    case 'admin-settings':
      return <AdminSettings />;
    case 'cookies':
      return <CookiesView />;
    case 'privacy':
      return <PrivacyView />;
    default:
      return <HomeView />;
  }
}

export default function Home() {
  const { view, isLoading, fetchUser, fetchServices } = useStore();

  useEffect(() => {
    fetchUser();
    fetchServices();
  }, [fetchUser, fetchServices]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f0ff]"></div>
      </div>
    );
  }

  return (
    <DaxLayout>
      <ViewRouter view={view} />
    </DaxLayout>
  );
}
