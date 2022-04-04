import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  // Load the public key stripe instance
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY).then((stripeJs) => {
    return stripeJs;
  });
}