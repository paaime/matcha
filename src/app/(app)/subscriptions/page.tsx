import clsx from 'clsx';
import { CheckIcon } from '@heroicons/react/20/solid';
import { pricing } from '@/data/subscriptions';
import Link from 'next/link';
import CheckoutButton from '@/components/Subscriptions/CheckoutButton';
import { getAuthSession } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

export default async function Subscriptions() {
  const session = await getAuthSession();

  return (
    <div className="space-y-6">
      <div className="border-b pb-6 space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
        <p className="text-muted-foreground">
          Explore our pricing and manage your subscription.
        </p>
      </div>
      <div className="isolate grid grid-cols-1   md:grid-cols-2 xl:mx-0 xl:grid-cols-4 gap-4">
        {pricing.tiers.map((tier) => (
          <Card
            className={clsx(
              'rounded-xl',
              tier.mostPopular && '!border-indigo-600'
            )}
            key={tier.id}
          >
            <CardHeader className="pb-2 flex-row items-center space-y-0 justify-between">
              <CardTitle className="font-medium">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-2xl font-bold">
                {tier.price[pricing.frequencies[0].value]}
                <span className="ml-1 text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                  {pricing.frequencies[0].priceSuffix}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {tier.description}
              </p>
              {session.user.subscription === tier.id ? (
                <Link
                  href="/"
                  aria-describedby={tier.id}
                  className={clsx(
                    buttonVariants({
                      variant: 'secondary',
                    })
                  )}
                >
                  Manage
                </Link>
              ) : (
                <CheckoutButton
                  createCheckoutLink={() => console.log('Create checkout link')}
                  tier={tier}
                />
              )}
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-indigo-600 dark:text-white"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="md:flex items-end justify-between">
        <CardHeader>
          <CardTitle className="font-medium">Manage subscription</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
            voluptatibus corrupti atque repudiandae nam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            type="button"
            className="w-full justify-center md:justify-normal md:w-auto inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href={'/'}
          >
            Manage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
