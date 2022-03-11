import Head from 'next/head';
import homeStyles from '../styles/home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Início | bald.news</title>
      </Head>
      <h1 className={homeStyles.title}>
        Hello <span>filho da puta</span>
      </h1>
    </>
  )
}
