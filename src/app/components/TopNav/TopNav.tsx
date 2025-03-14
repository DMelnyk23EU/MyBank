'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './TopNav.module.scss';
import Image from 'next/image';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslations } from 'next-intl';  // Import the useTranslations hook

interface TopNavProps {
  isLoggedIn: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ isLoggedIn }) => {

  const t = useTranslations();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Function to toggle the burger menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(`.${styles.contextualMenu}`);
      const burgerIcon = document.querySelector(`.${styles.burgerIcon}`);
      if (
        menu && !menu.contains(event.target as Node) &&
        burgerIcon && !burgerIcon.contains(event.target as Node)
      ) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Image className={styles.logoImg} src="/bankIcon.svg" alt="Menu Icon" width={24} height={24} priority />
          <Link href="/">MyBank</Link>
        </div>

        <Image className={styles.burgerIcon} src="/burgerMenuIcon.svg" alt="Menu Icon" width={24} height={24} priority onClick={toggleMenu} />

        {/* Navigation links for desktop (on the right side) */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>{t('topNav.home')}</Link>
          <Link href="/about" className={styles.link}>{t('topNav.about')}</Link>
          <Link href="/services" className={styles.link}>{t('topNav.services')}</Link>
          <Link href={isLoggedIn ? "/profile" : "/login"} className={styles.link}>
            {isLoggedIn ? t('topNav.profile') : t('topNav.login')}
          </Link>
          <LanguageSelector />
        </div>
      </div>

      {/* Contextual Menu for mobile (shown when burger menu is clicked) */}
      <div className={`${styles.contextualMenu} ${isMenuOpen ? styles.openMenu : ''}`}>
        <button className={styles.closeButton} onClick={() => setIsMenuOpen(false)}>
          &times;
        </button>
        <ul className={styles.menuItems}>
          <li className={styles.menuItem}>
            <Link href="/" className={styles.link}>{t('topNav.home')}</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/about" className={styles.link}>{t('topNav.about')}</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/services" className={styles.link}>{t('topNav.services')}</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={isLoggedIn ? "/profile" : "/login"} className={styles.link}>
              {isLoggedIn ? t('topNav.profile') : t('topNav.login')}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
