'use client';

import { useEffect, useState } from 'react';
import styles from './profileEdit.module.scss';
import { useTranslations } from 'next-intl';  // Import the useTranslations hook
import TextField from '@/app/components/TextField/TextField';
import ImageInput from '@/app/components/ImageInput/ImageInput';
import Button from '@/app/components/Button/Button';
import { v4 as uuidv4 } from 'uuid';
import { IAccount } from '@/interfaces/IAccount';
import { CurrenciesEnum } from '@/enums/CurrenciesEnum';
import { validateEmail, validatePassword } from '@/helpers/stringHelper';
import useDebouncedValidation from '@/hooks/debounceValidation';
import { IResponce } from '@/interfaces/IResponce';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store/GlobalStore';
import Spinner from '@/app/components/Spinner/Spinner';
import { useRouter } from 'next/navigation';
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

export default function EditProfile() {
  const router = useRouter();

  const t = useTranslations();
  const [accountToEdit, setAccountToEdit] = useState<IAccount>(initAccountValue);
  const [editRes, setEditRes] = useState<IResponce | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const account = useSelector((state: GlobalState) => state.account);

  useEffect(() => {
    if (!account?.id && editRes === undefined) {
      router.push(`/login`);
    }
    else {
      setAccountToEdit(account);
    }
  }, [account, editRes]);

  const emailError = useDebouncedValidation(validateEmail, accountToEdit?.email, t('login.emailInvalid'), 1000);
  const passwordError = useDebouncedValidation(validatePassword, accountToEdit?.password, t('login.passwordInvalid'), 1000);


  useEffect(() => {
    if (editRes?.type === 'success') {
      setTimeout(() => {
        router.push(`/profile/${accountToEdit.id}`);
      }, 1000);
    }
  }, [editRes?.type, accountToEdit.id]);

  // Handling the form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setEditRes(undefined);
      setIsLoading(true);

      const res = await fetch(`http://localhost:3000/api/users/${account?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountToEdit),
      });

      const data = await res?.json()

      if (data.user) {
        router.push(`/profile/${data.user.id}`);
      }
      else {
        setEditRes({
          type: 'error',
          title: t('common.error'),
          description: t('register.registerError'),
        })
      }
    }
    catch (error) {
      console.error(error);
      setEditRes({
        type: 'error',
        title: t('common.somethingWentWrong'),
        description: t('register.registerError'),
      })
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = (): boolean => {

    if (JSON.stringify(accountToEdit) === JSON.stringify(account)) {
      return true;
    }

    if (emailError || passwordError || !validateEmail(accountToEdit?.email) || !validatePassword(accountToEdit?.password) || !accountToEdit?.name || !accountToEdit?.currency) {
      return true;
    }
    return false
  }

  const onMessagePopupClose = () => {
    setEditRes(undefined);
  }

  const onUserDelete = async () => {

    try {
      setEditRes(undefined);
      setIsLoading(true);

      const res = await fetch(`http://localhost:3000/api/users/${account?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res?.json()

      if (data.ok) {
        router.push(`/login`);
      }
      else {
        setEditRes({
          type: 'error',
          title: t('common.error'),
          description: t('register.registerError'),
        })
      }
    }
    catch (error) {
      console.error(error);

      setEditRes({
        type: 'error',
        title: t('common.somethingWentWrong'),
        description: t('register.registerError'),
      })
      setIsLoading(false);
    }

  }

  return (
    <div className={'page'}>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.form} >
          <ImageInput
            className={styles.imageInput}
            value={accountToEdit?.profilePicture}
            onImageUpload={(base64) => setAccountToEdit(prev => ({ ...prev, profilePicture: base64 }))}
            size={150}
          />
          <TextField
            type="text"
            id="name"
            label={t('login.userName')}
            name="name"
            value={accountToEdit?.name}
            onChange={(e) => setAccountToEdit(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('login.userNamePlaceholder')}
            required
          />
          <TextField
            type="email"
            id="email"
            label={t('login.email')}
            name="email"
            value={accountToEdit?.email}
            onChange={(e) => setAccountToEdit(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t('login.emailPlaceholder')}
            required
            error={emailError}
          />
          <Button
            label={t('login.update')}
            disabled={isSubmitDisabled()}
            type="submit"
          />
          <input disabled={isLoading} className={styles.delete} type="button" value={t('login.delete')} onClick={onUserDelete} />
        </form>
        {
          isLoading &&
          <Spinner isGlobalSpinner label={editRes?.type === 'success' ? editRes?.description : t('login.logginInMessage')} size={35} />
        }
        {
          editRes?.type === 'error' &&
          <MessagePopup
            type={editRes.type}
            title={editRes.title}
            description={editRes.description}
            onClose={onMessagePopupClose}
          />
        }
      </div>
    </div>
  );
}
