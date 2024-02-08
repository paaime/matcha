import { plans } from '@/data/subscriptions';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SubscriberOnly() {
  const session = await getAuthSession();

  if (!plans.includes(session?.user?.subscription)) {
    redirect('/subscriptions');
  }

  return (
    <div>
      <h1>Subscriber Only</h1>
      <p>This page is only available to subscribers.</p>
    </div>
  );
}
