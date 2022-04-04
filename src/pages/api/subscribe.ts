import { PostgrestResponse } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { stripe } from "../../services/stripe";
import { supabase } from "../../services/supabase";

type User = {
  id: number,
  email: string,
  created_at: Date,
  stripe_id: string | null,
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('\n--- Starting subscription process ---\n');
    const session = await getSession({ req });

    const createStripeCustumer = async (): Promise<string> => {
      // Create the stripe custumer
      return stripe.customers.create({
        email: session.user.email,
      }).then(async ({ id }) => {
        if (id !== '') {
          console.log('\nStripe custumer created successfully\n');
          const updateUserDBResult = await supabase
            .from('users')
            .update({ stripe_id: id }, {
              returning: 'minimal'
            })
            .eq('email', session.user.email);
          
          if (updateUserDBResult.status !== 204)
            console.error(`\nError adding stripe custumer id to the database\n${JSON.stringify(updateUserDBResult.body)}\n`);
          else
            console.log('\nStripe custumer id updated to the database successfully\n');
        } else {
          console.error(`\nError creating stripe custumer\n`);
        }

        return id;
      });
    }

    const createStripeCheckout = async (stripeCustomerId: string): Promise<string> => {
      // Create the subscription baseated in the created stripe custumer
      return stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
          {
            price: 'price_1Kek1TIjcs9sMbhDKWWDtPp5',
            quantity: 1
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      }).then(({ id }) => {
        if (id !== '') {
          console.log('\nStripe checkout session created successfully\n');
        } else {
          console.error(`\nError creating stripe checkout session\n`);
        }
  
        return id;
      });
    }

    const userCreatedStripeId = await supabase
      .from('users')
      .select('stripe_id')
      .eq('email', session.user.email)
      .then(function (userRequestResult: PostgrestResponse<User>): string | null {
        if (userRequestResult.status === 200 && userRequestResult.data[0].stripe_id !== null) {
          console.log('\nStripe user already exists\n');
        } else if (userRequestResult.data[0].stripe_id === null) {
          console.log('\nStripe user still not exists\n');
        } else {
          console.error(`\nError looking for the stripe existing custumer\n${userRequestResult.error}\n`);
        }

        return userRequestResult.data[0].stripe_id;
      });

    var sessionId = '';
    if (userCreatedStripeId === null) {
      var stripeCustId = await createStripeCustumer();
      if (stripeCustId === '')
        return res.status(402).end('Error creating stripe custumer');
      sessionId = await createStripeCheckout(stripeCustId);
    } else {
      sessionId = await createStripeCheckout(userCreatedStripeId);
    }

    console.log('\n--- Endind subscription process ---\n');

    if (sessionId === '')
      return res.status(402).end('Error creating stripe session');
    else
      return res.status(201).json({ sessionId })
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}