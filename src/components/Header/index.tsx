import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/favicon.png" alt="" />
        <h1>bald.news</h1>
        <nav>
          <a href="" className={styles.active}>Home</a>
          <a href="/posts">Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}