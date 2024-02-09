export const plans = ['starter', 'freelancer', 'startup', 'enterprise'];

export const pricesId = {
  price_1Oek8ZECr3GiBYRYkyVzyXUw: 'starter',
  price_1J9s3JHjW8d7s4vD8ZQkxj0Y: 'freelancer',
  price_1J9s3JHjW8d7s4vD8ZQkxj0b: 'startup',
  price_1J9s3JHjW8d7s4vD8ZQkxj0a: 'enterprise',
};

export const pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
    { value: 'annually', label: 'Annually', priceSuffix: '/year' },
  ],
  tiers: [
    {
      name: 'Starter',
      id: 'starter',
      href: '#',
      price: { monthly: '$9.99', annually: '$100' },
      description: 'The essentials to provide your best work for clients.',
      features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
      mostPopular: false,
      productId: 'price_1Oek8ZECr3GiBYRYkyVzyXUw',
    },
    {
      name: 'Freelancer',
      id: 'freelancer',
      href: '#',
      price: { monthly: '$30', annually: '$288' },
      description: 'The essentials to provide your best work for clients.',
      features: [
        '5 products',
        'Up to 1,000 subscribers',
        'Basic analytics',
        '48-hour support response time',
      ],
      mostPopular: false,
      productId: pricesId.price_1J9s3JHjW8d7s4vD8ZQkxj0a,
    },
    {
      name: 'Startup',
      id: 'startup',
      href: '#',
      price: { monthly: '$60', annually: '$576' },
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      mostPopular: true,
      productId: pricesId.price_1J9s3JHjW8d7s4vD8ZQkxj0b,
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      href: '#',
      price: { monthly: '$90', annually: '$864' },
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom reporting tools',
      ],
      mostPopular: false,
      productId: pricesId.price_1Oek8ZECr3GiBYRYkyVzyXUw,
    },
  ],
};
