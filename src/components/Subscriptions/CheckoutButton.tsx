'use client';

import clsx from 'clsx';
import { useTransition } from 'react';
import { Button } from '../ui/button';

export default function CheckoutButton({
  createCheckoutLink,
  tier,
}: {
  createCheckoutLink;
  tier: any;
}) {
  let [isPending, startTransition] = useTransition();

  const handleCheckout = async () => {
    const checkoutLink = await createCheckoutLink(tier.productId);

    // redirect to checkout link
    if (checkoutLink) window.location.href = checkoutLink;
  };

  return (
    <Button
      onClick={() => startTransition(handleCheckout)}
      aria-describedby={tier.id}
      className={clsx(
        tier.mostPopular && 'bg-indigo-600 hover:bg-indigo-500 text-white'
      )}
    >
      {isPending ? 'Processing...' : 'Buy plan'}
    </Button>
  );
}
