import StripeInstance from 'stripe';
import packageInfo from '../../package.json';

export const stripe = new StripeInstance(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2020-08-27",
    appInfo: {
      name: packageInfo.name,
      version: packageInfo.version
    },
  }
);
