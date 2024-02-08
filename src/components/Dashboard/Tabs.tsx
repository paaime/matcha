'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataCard } from '@/components/Dashboard/DataCard';
import { ChartCard } from '@/components/Dashboard/ChartCard';
import { History } from '@/components/Dashboard/History';

export default function DashTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Reports
        </TabsTrigger>
        <TabsTrigger value="notifications" disabled>
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DataCard />
          <DataCard />
          <DataCard />
          <DataCard />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ChartCard />
          <History />
        </div>
      </TabsContent>
    </Tabs>
  );
}
