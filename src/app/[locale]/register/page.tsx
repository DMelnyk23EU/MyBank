// src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './register.module.scss';
import { useTranslations } from 'next-intl';  // Import the useTranslations hook
import TextField from '@/app/components/TextField/TextField';
import ImageInput from '@/app/components/ImageInput/ImageInput';
import Dropdown from '@/app/components/Dropdown/Dropdown';
import Button from '@/app/components/Button/Button';
import { v4 as uuidv4 } from 'uuid';
import { IAccount } from '@/interfaces/IAccount';
import { Currency } from '@/customTypes/Currency';
import { CurrenciesEnum } from '@/enums/CurrenciesEnum';
import { validateEmail, validatePassword } from '@/helpers/stringHelper';
import useDebouncedValidation from '@/hooks/debounceValidation';
import { IResponce } from '@/interfaces/IResponce';
import { useDispatch } from 'react-redux';
import { setAccount } from '@/store/GlobalStore';
import Spinner from '@/app/components/Spinner/Spinner';
import { redirect } from 'next/navigation';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';

const initAccountValue: IAccount = {
  id: uuidv4(),
  name: '',
  email: '',
  password: '',
  currency: CurrenciesEnum.EUR,
  profilePicture: '',
  balance: 5000,
}

export default function Register() {

  const t = useTranslations();
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  const [accountToRegister, setAccountToRegister] = useState<IAccount>(initAccountValue);
  const [registerRes, setRegisterRes] = useState<IResponce | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const emailError = useDebouncedValidation(validateEmail, accountToRegister?.email, t('login.emailInvalid'), 1000);
  const passwordError = useDebouncedValidation(validatePassword, accountToRegister?.password, t('login.passwordInvalid'), 1000);


  useEffect(() => {
    if (registerRes?.type === 'success') {
      setTimeout(() => {
        redirect(`/profile/${accountToRegister.id}`);
      }, 1000);
    }
  }, [registerRes?.type, accountToRegister.id]);

  // Handling the form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setRegisterRes(undefined);
      setIsLoading(true);
      // const user = await fetch(`http://localhost:3000/api/users`, { method: 'POST', body: JSON.stringify(accountToRegister) }).then(res => res.json());

      const res = await fetch(`http://localhost:3000/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountToRegister),
      });


      const user: IAccount = await res?.json()

      if (user) {
        dispatch(setAccount(user));

        setRegisterRes({
          type: 'success',
          title: t('common.success'),
          description: t('register.registerSuccess'),
        });
      }
      else {
        setRegisterRes({
          type: 'error',
          title: t('common.error'),
          description: t('register.registerError'),
        })
      }
    }
    catch (error) {
      console.error(error);
      setRegisterRes({
        type: 'error',
        title: t('common.somethingWentWrong'),
        description: t('register.registerError'),
      })
      setIsLoading(false);
    }
  };

  const options = Object?.keys(CurrenciesEnum)?.map(key => ({ key, label: key?.toUpperCase() }));

  const passwordsMatched = (): boolean => {
    if (accountToRegister?.password?.length > 0 && passwordRepeat?.length > 0 && passwordRepeat !== accountToRegister?.password) {
      return false;
    }

    return true;
  };

  const isSubmitDisabled = (): boolean => {
    if (emailError || passwordError || !validateEmail(accountToRegister?.email) || !validatePassword(accountToRegister?.password) || passwordRepeat !== accountToRegister?.password || !accountToRegister?.name || !accountToRegister?.currency) {
      return true;
    }
    return false
  }

  const onMessagePopupClose = () => {
    if (registerRes?.type === 'success') {
      redirect('/profile');
    }
    setRegisterRes(undefined);
  }

  return (
    <div className={'page'}>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.form} >
          <ImageInput
            className={styles.imageInput}
            value={accountToRegister?.profilePicture}
            onImageUpload={(base64) => setAccountToRegister(prev => ({ ...prev, profilePicture: base64 }))}
            size={150}
          />
          <TextField
            type="text"
            id="name"
            label={t('login.userName')}
            name="name"
            value={accountToRegister?.name}
            onChange={(e) => setAccountToRegister(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('login.userNamePlaceholder')}
            required
          />
          <Dropdown
            label={t('fields.currencySelectLabel')}
            options={options}
            selectedValue={options?.find(o => o.key === accountToRegister.currency)?.label ?? ''}
            onChange={(val) => {
              setAccountToRegister(prev => ({ ...prev, currency: val as Currency }));
            }} />
          <TextField
            type="email"
            id="email"
            label={t('login.email')}
            name="email"
            value={accountToRegister?.email}
            onChange={(e) => setAccountToRegister(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t('login.emailPlaceholder')}
            required
            error={emailError}
          />
          <TextField
            type="password"
            id="password"
            label={t('login.password')}
            name="password"
            value={accountToRegister?.password}
            onChange={(e) => setAccountToRegister(prev => ({ ...prev, password: e.target.value }))}
            placeholder={t('login.passwordPlaceholder')}
            required
            error={passwordError}
          />
          <TextField
            type="password"
            id="passwordRepeat"
            label={t('login.passwordRepeat')}
            name="passwordRepeat"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            placeholder={t('login.passwordRepeatPlaceholder')}
            required
            error={!passwordsMatched() ? t('validations.passwordRepeatError') : undefined}
          />
          <Button
            label={t('login.submit')}
            disabled={isSubmitDisabled()}
            type="submit"
          />
        </form>
        {
          isLoading &&
          <Spinner isGlobalSpinner label={registerRes?.type === 'success' ? registerRes?.description : t('login.logginInMessage')} size={35} />
        }
        {
          registerRes?.type === 'error' &&
          <MessagePopup
            type={registerRes.type}
            title={registerRes.title}
            description={registerRes.description}
            onClose={onMessagePopupClose}
          />
        }
      </div>
    </div>
  );
}
