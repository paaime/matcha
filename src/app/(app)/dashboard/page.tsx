import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import { Button } from '@/components/ui/button';
import DashTabs from '@/components/Dashboard/Tabs';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6 flex flex-col md:flex-row md:items-center justify-between space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange />
          <Button>Download</Button>
        </div>
      </div>
      <DashTabs />
    </div>
  );
}
