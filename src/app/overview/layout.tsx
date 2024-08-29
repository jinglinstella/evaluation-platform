'use client';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthProvider } from "src/app/Providers";

type Props = {
  children: React.ReactNode;
};

export default function Layout({children}: Props) {
  return (
    <AuthProvider>
      <DashboardLayout bgColor='#f6f6f6' hideFooter>{children}</DashboardLayout>
    </AuthProvider>
  );
}