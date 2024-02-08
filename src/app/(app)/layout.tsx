import Header from '@/components/Header';
import Menu from '@/components/Menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FDF7FD] min-h-screen ">
      <main className="max-w-screen-sm mx-auto p-5">
        <Header />
        {children}
      </main>
      <Menu />
    </div>
  );
}
