"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './LanguageSelector.module.scss';
import { useLocale } from 'next-intl';

const LanguageSelector: React.FC = () => {

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const locale = useLocale();  // Use the useLocale hook to get the current locale
  const menuRef = useRef<HTMLDivElement>(null);  // Ref for the menu
  const buttonRef = useRef<HTMLButtonElement>(null);  // Ref for the button

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target as Node) &&
      buttonRef.current && !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false); // Close the menu if clicked outside
    }
  };

  useEffect(() => {
    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Handle the language change
  const handleLocaleChange = (val: string) => {
    // Get current path and replace only the locale part
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[^\/]+/, `/${val}`);
    router.push(newPath || `/${val}`);
    setIsMenuOpen(false); // Close the menu
  };

  return (
    <div className={styles.languageSelector}>
      {/* Button with an image inside (24x24 pixels) */}
      <button ref={buttonRef} className={styles.button} onClick={toggleMenu}>
        <Image
          className={styles.icon}
          src="/globe.svg" // Put your icon path here
          alt="Language Icon"
          width={20}
          height={20}
          priority
        />
        <p className={styles.localeVal}>{locale?.toUpperCase()}</p>
      </button>

      {/* Contextual menu for language selection */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.menu}>
          <ul>
            <li onClick={() => handleLocaleChange('en')}>English</li>
            <li onClick={() => handleLocaleChange('de')}>Deutsch</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
