// src/app/login/page.tsx
'use client';

import { useState } from 'react';
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
  const [account, setAccount] = useState<IAccount>(initAccountValue);

  const emailError = useDebouncedValidation(validateEmail, account?.email, t('login.emailInvalid'), 1000);
  const passwordError = useDebouncedValidation(validatePassword, account?.password, t('login.passwordInvalid'), 1000);


  // Handling the form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform login logic here
    console.log('Email:', account?.email);
    console.log('Password:', account?.password);
  };

  const options = Object?.keys(CurrenciesEnum)?.map(key => ({ key, label: key?.toUpperCase() }));

  const passwordsMatched = (): boolean => {
    if (account?.password?.length > 0 && passwordRepeat?.length > 0 && passwordRepeat !== account?.password) {
      return false;
    }

    return true;
  };

  const isSubmitDisabled = (): boolean => {
    if (emailError || passwordError || !validateEmail(account?.email) || !validatePassword(account?.password) || passwordRepeat !== account?.password || !account?.name || !account?.currency) {
      return true;
    }
    return false
  }

  return (
    <div className={'page'}>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.form} >
          <ImageInput className={styles.imageInput} value={account?.profilePicture} onImageUpload={(base64) => setAccount(prev => ({ ...prev, profilePicture: base64 }))} />
          <TextField
            type="text"
            id="name"
            label={t('login.userName')}
            name="name"
            value={account?.name}
            onChange={(e) => setAccount(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('login.userNamePlaceholder')}
            required
          />
          <Dropdown
            label={t('fields.currencySelectLabel')}
            options={options}
            selectedValue={options?.find(o => o.key === account.currency)?.label ?? ''}
            onChange={(val) => {
              setAccount(prev => ({ ...prev, currency: val as Currency }));
            }} />
          <TextField
            type="email"
            id="email"
            label={t('login.email')}
            name="email"
            value={account?.email}
            onChange={(e) => setAccount(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t('login.emailPlaceholder')}
            required
            error={emailError}
          />
          <TextField
            type="password"
            id="password"
            label={t('login.password')}
            name="password"
            value={account?.password}
            onChange={(e) => setAccount(prev => ({ ...prev, password: e.target.value }))}
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
      </div>
    </div>
  );
}
