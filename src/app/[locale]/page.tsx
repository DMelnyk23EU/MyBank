
import React from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import { getMessages } from "next-intl/server";

export default async function Home() {
  const messages = await getMessages();

  return (
    <div className={'page'}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image src="/bankIcon.svg" alt="Menu Icon" width={100} height={100} priority />
          <h1 className={styles.title}>{messages.welcome} MyBank</h1>
        </div>

        <div className={styles.welcomeMessage}>
          <h2>Welcome to Your Bank Account Manager</h2>
          <p>Manage your bank accounts, view balances, and perform transactions with ease.</p>
        </div>
      </div>
    </div>
  );
}
