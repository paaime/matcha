export interface IUser {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  emailVerified: Date;
  password: string;
  image: string;
  createdAt: Date;
  active: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}
