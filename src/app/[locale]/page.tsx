
import React from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import { getMessages } from "next-intl/server";

export default async function Home() {
  const translations = await getMessages();

  return (
    <div className={'page'}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image src="/bankIcon.svg" alt="Menu Icon" width={100} height={100} priority />
          <h1 className={styles.title}>{translations.homePage.welcome} MyBank</h1>
        </div>
        <div className={styles.welcomeMessage}>
          <h2>{translations.homePage.title}</h2>
          <p>{translations.homePage.description}</p>
        </div>
      </div>
    </div>
  );
}
