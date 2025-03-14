// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import styles from './login.module.scss';
import { useTranslations } from 'next-intl';  // Import the useTranslations hook
import Link from 'next/link'; // Import Link for navigation

export default function Login() {

  const t = useTranslations();

  // State for email, password, and validation error
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | undefined>('');

  // Handling the form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validate the email
    if (!emailRegex.test(email)) {
      setEmailError(t('login.invalidEmail')); // Set the error message
      return; // Don't submit the form if email is invalid
    }

    setEmailError(undefined); // Clear the error if email is valid

    // Perform login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className={'page'}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.textFieldLabel} htmlFor="email">{t('login.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
            />
            {emailError && <p className={styles.error}>{emailError}</p>} {/* Display error message if invalid */}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.textFieldLabel} htmlFor="password">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {t('login.submit')}
          </button>

          <div className={styles.registerLink}>
            <p>{t('login.dontHaveAccount')}</p>
            <Link href="/register" className={styles.registerButton}>
              {t('login.registerHere')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
