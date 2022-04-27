import { stripe } from "../../../services/stripe";
import { supabase } from "../../../services/supabase";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
): Promise<boolean> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return supabase
    .from('stripe_subscriptions')
    .insert({ 
      id: subscription.id,
      customer_id: customerId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    }, {
        returning: 'minimal'
    }).then((result) => {
      if (result.status === 201) {
        console.log(`\nSubscription created successfully\n`);
        return true;
      } else {  
        console.error(`\nCreating subscription error\n${JSON.stringify(result.error)}\n`);
        return false;
      }
    });
}

export async function updateSubscription(
    subscriptionId: string,
    customerId: string
): Promise<boolean> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log(subscription);
  return supabase
    .from('stripe_subscriptions')
    .update({ 
      customer_id: customerId,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    }, {
      returning: 'minimal'
    })
    .match({ id: subscription.id })
    .then((result) => {
      if (result.status === 201) {
        console.log(`\nSubscription updated successfully\n`);
        return true;
      } else {  
        console.error(`\nUpdating subscription error\n${JSON.stringify(result.error)}\n`);
        return false;
      }
    });
}