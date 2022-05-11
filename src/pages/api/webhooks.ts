import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription, updateSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Stripe webhook error: ${err.message}`);
    }
    
    if (relevantEvents.has(event.type)) {
      console.log(`Relevant event detected: ${event.type}`);
      try {
        switch (event.type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscriptionUpdate = event.data.object as Stripe.Subscription;
            const subUpdResult = await updateSubscription(
              subscriptionUpdate.id,
              subscriptionUpdate.customer.toString()
            );

            if (!subUpdResult)
              return res.status(500).json({ message: 'Subscription update failed.' });
            
            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            const subSaveResult = await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );

            if (!subSaveResult)
              return res.status(500).json({ message: 'Subscription saving failed.' });
            
            break;
          default:
            throw new Error('Unhandled event.');
        }
      } catch (err) {
        return res.status(500).json({ error: 'Webhook handler failed.' })
      }
      
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}