import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DataCard() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2 flex-row items-center space-y-0 justify-between">
        <CardTitle className="text-sm font-medium">Create project</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$45,231.89</p>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
}
