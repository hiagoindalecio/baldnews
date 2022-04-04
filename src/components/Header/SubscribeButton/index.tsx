import { useSession, signIn } from 'next-auth/react';

import { api } from '../../../services/api';
import { getStripeJs } from '../../../services/stripe-js';

import styles from './styles.module.scss';

type SubscribeButtonProps = {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    // criação da checkout session
    try {
      const resp = await api.post('/subscribe');
      if (resp.status === 201) {
        const { sessionId } = resp.data;
        getStripeJs().then(async (stripe) => {
          await stripe.redirectToCheckout({ sessionId });
        });
      } else {
        console.error(`\nError while stripe subscribing\n${JSON.stringify(resp)}\n`);
      }
    } catch (err) {
      console.error(`\nError while stripe subscribing\n${err}\n`);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => {handleSubscribe()}}>
      Subscribe now
    </button>
  )
}
