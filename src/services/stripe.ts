import StripeInstance from 'stripe';
import { version as appVersion, name as appName } from '../../package.json';

export const stripe = new StripeInstance(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2020-08-27",
    appInfo: {
      name: appName,
      version: appVersion
    },
  }
)