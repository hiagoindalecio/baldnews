import Head from 'next/head';
import { GetStaticProps } from 'next'
import { SubscribeButton } from '../components/Header/SubscribeButton';
import { stripe } from '../services/stripe';

import homeStyles from './home.module.scss';

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | bald.news</title>
      </Head>
      <main className={homeStyles.contentContainer}>
        <section className={homeStyles.hero}>
          <span>😳 Hey, senpai</span>
          <h1>Ready to see news about the <span>world</span> 🌎?</h1>
          <h3>by a bald guy</h3>
          <p>
            Get access to all the content <br/>
            <span>for only {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/girl-anime-aesthetic.png" alt="girl-avatar" />
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Kek1TIjcs9sMbhDKWWDtPp5');

  const product = {
    priceId:  price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
