import AdminSidebar from '@/components/AdminSidebar';
import Header from '@/components/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <AdminSidebar />
      <main className="pl-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
