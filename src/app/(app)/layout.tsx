import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div className="lg:ml-72">
        <Header />
        <main className="min-h-screen p-6">{children}</main>
      </div>
    </div>
  );
}
