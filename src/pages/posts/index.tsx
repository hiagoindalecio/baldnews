import { GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
    <Head>
      <title>Posts | bald.news</title>
    </Head>

    <main className={styles.container}>
      <div className={styles.posts}>
        {
          posts.map(post => (
            <a key={post.slug} href={`${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
            </a>
          ))
        }
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

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      content: post.data.content.find((content: { type: string; text: string; }) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}