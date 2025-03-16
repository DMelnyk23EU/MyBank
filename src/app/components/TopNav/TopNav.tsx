'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './TopNav.module.scss';
import Image from 'next/image';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslations } from 'next-intl';  // Import the useTranslations hook
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from '@/store/GlobalStore';
import { logout } from '@/store/GlobalStore';

const TopNav: React.FC = () => {

  const t = useTranslations();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const account = useSelector((state: GlobalState) => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setIsLoggedIn(Boolean(account?.id?.length));
    })();
  }, [account]);

  // Function to toggle the burger menu in mobile view
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the burger menu when clicking outside of it
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

  const onLogoutClick = () => {
    dispatch(logout());
    setIsMenuOpen(false)
  }

  console.log('isLoggedIn', isLoggedIn);


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
          {
            isLoggedIn && (
              <Link href={`/transactions`} className={styles.link}>{t('topNav.transactions')}</Link>
            )
          }
          {
            isLoggedIn ?
              <>
                <Link href={`/profile/${account?.id}`} className={styles.link}>
                  {t('topNav.profile')}
                </Link>
                <Link href={`/profile/${account?.id}/edit`} className={styles.link}>
                  {t('topNav.profileEdit')}
                </Link>
              </>
              :
              <Link href={'/login'} className={styles.link}>
                {t('topNav.login')}
              </Link>
          }
          {
            isLoggedIn && (
              <Link href="/" onClick={onLogoutClick} className={styles.link}>{t('topNav.logout')}</Link>
            )
          }
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
            <Link onClick={() => setIsMenuOpen(false)} href="/" className={styles.link}>{t('topNav.home')}</Link>
          </li>
          {
            isLoggedIn &&
            <li className={styles.menuItem}>
              <Link onClick={() => setIsMenuOpen(false)} href={`/transactions`} className={styles.link}>{t('topNav.transactions')}</Link>
            </li>
          }

          {
            isLoggedIn ?
              <>
                <li className={styles.menuItem}>
                  <Link href={`/profile/${account?.id}`} className={styles.link}>
                    {t('topNav.profile')}
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link href={`/profile/${account?.id}/edit`} className={styles.link}>
                    {t('topNav.profileEdit')}
                  </Link>
                </li>
              </>
              :
              <li className={styles.menuItem}>
                <Link href={'/login'} className={styles.link}>
                  {t('topNav.login')}
                </Link>
              </li>
          }
          {
            isLoggedIn &&
            <li className={styles.menuItem}>
              <Link href="/" onClick={onLogoutClick} className={styles.link}>{t('topNav.logout')}</Link>
            </li>
          }

          <li className={styles.menuItem}>
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
