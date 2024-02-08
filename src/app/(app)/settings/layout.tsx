import Menu from '@/components/Settings/Menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6 space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Menu />
        {children}
      </div>
    </div>
  );
}
