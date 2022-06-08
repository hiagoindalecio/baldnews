import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
    <Head>
      <title>Posts | bald.news</title>
    </Head>

    <main className={styles.container}>
      <div className={styles.posts}>
        <a href="#">
          <time>12 de março de 2005</time>
          <strong>Pare com esse negócio de lepo lepo</strong>
          <p>No lepo lepoooooo eu é tão gostodso ahahahahahaha lepo lepooooo hahahahahahaha é no meu hahahaha no lepo lepooooo</p>
        </a>
        <a href="#">
          <time>12 de março de 2005</time>
          <strong>Pare com esse negócio de lepo lepo</strong>
          <p>No lepo lepoooooo eu é tão gostodso ahahahahahaha lepo lepooooo hahahahahahaha é no meu hahahaha no lepo lepooooo</p>
        </a>
        <a href="#">
          <time>12 de março de 2005</time>
          <strong>Pare com esse negócio de lepo lepo</strong>
          <p>No lepo lepoooooo eu é tão gostodso ahahahahahaha lepo lepooooo hahahahahahaha é no meu hahahaha no lepo lepooooo</p>
        </a>
        <a href="#">
          <time>12 de março de 2005</time>
          <strong>Pare com esse negócio de lepo lepo</strong>
          <p>No lepo lepoooooo eu é tão gostodso ahahahahahaha lepo lepooooo hahahahahahaha é no meu hahahaha no lepo lepooooo</p>
        </a>
      </div>
    </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.getByType('post', { 
    fetch: [
      'post.title',
      'post.content'
    ],
    pageSize: 100,
  });

  console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      
    }
  }
}