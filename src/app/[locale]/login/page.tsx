'use client';

import { useEffect, useState } from 'react';
import styles from './login.module.scss';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import TextField from '@/app/components/TextField/TextField';
import Button from '@/app/components/Button/Button';
import { useDispatch, useSelector } from "react-redux";
import { GlobalState, setAccount } from '@/store/GlobalStore';
import Spinner from '@/app/components/Spinner/Spinner';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';
import { IResponce } from '@/interfaces/IResponce';
import { validateEmail, validatePassword } from '@/helpers/stringHelper';
import useDebouncedValidation from '@/hooks/debounceValidation';
import { redirect } from 'next/navigation';

export default function Login() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginRes, setLoginRes] = useState<IResponce | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const emailError = useDebouncedValidation(validateEmail, email, t('login.emailInvalid'), 1000);
  const passwordError = useDebouncedValidation(validatePassword, password, t('login.passwordInvalid'), 1000);
  const account = useSelector((state: GlobalState) => state.account);

  const isSubmitDisabled = (): boolean => {
    if (emailError || passwordError || !validateEmail(email) || !validatePassword(password)) {
      return true;
    }
    return false
  }

  useEffect(() => {
    if (loginRes?.type === 'success') {
      setTimeout(() => {
        redirect(`/profile/${account.id}`);
      }, 1000);
    }
  }, [loginRes, account]);

  useEffect(() => {

    return () => {
      setLoginRes(undefined);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  }, [])

  // Handling the form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoginRes(undefined);
      setIsLoading(true);
      const res = await fetch(`http://localhost:3000/api/login`, { method: 'POST', body: JSON.stringify({ email, password }) });

      const data = await res?.json()

      if (!data?.message && data?.id) {
        dispatch(setAccount(data));
        setLoginRes({
          type: 'success',
          title: t('common.success'),
          description: t('login.loginSuccess'),
        });
      }
      else {
        setLoginRes({
          type: 'error',
          title: t('common.error'),
          description: t('login.loginError'),
        });
        setIsLoading(false);
      }

    }
    catch (error) {
      console.error(error);
      setLoginRes({
        type: 'error',
        title: t('common.somethingWentWrong'),
        description: t('login.loginError'),
      })
      setIsLoading(false);
    }
  };

  const onMessagePopupClose = () => {
    setLoginRes(undefined);
  }

  return (
    <div className={'page'}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            type="email"
            id="email"
            label={t('login.email')}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder')}
            required
            error={emailError}
          />
          <TextField
            type="password"
            id="password"
            label={t('login.password')}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder')}
            required
            error={passwordError}
          />
          <Button
            label={t('login.submit')}
            disabled={isSubmitDisabled()}
            type="submit"
          />

          <div className={styles.registerLink}>
            <p>{t('login.dontHaveAccount')}</p>
            <Link href="/register" className={styles.registerButton}>
              {t('login.registerHere')}
            </Link>
          </div>
        </form>
        {
          isLoading &&
          <Spinner isGlobalSpinner label={loginRes?.type === 'success' ? loginRes?.description : t('login.logginInMessage')} size={35} />
        }
        {
          loginRes?.type === 'error' &&
          <MessagePopup
            type={loginRes.type}
            title={loginRes.title}
            description={loginRes.description}
            onClose={onMessagePopupClose}
          />
        }
      </div>
    </div>
  );
}
