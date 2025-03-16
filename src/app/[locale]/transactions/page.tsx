'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import styles from './transactions.module.scss';
import { IResponce } from '@/interfaces/IResponce';
import Button from '@/app/components/Button/Button';
import Spinner from '@/app/components/Spinner/Spinner';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';
import { GlobalState, setAccount, setTransactions } from '@/store/GlobalStore';
import { ITransaction } from '@/interfaces/ITransaction';
import { v4 as uuidv4 } from 'uuid';
import TransactionsList from '@/app/components/TransactionsList/TransactionsList';
import Modal from '@/app/components/Modal/Modal';
import TextField from '@/app/components/TextField/TextField';
import { convertCurrency, getCurrencySymbol } from '@/helpers/currenciesHelper';
import { Currency } from '@/customTypes/Currency';
import { redirect } from 'next/navigation';

export default function Transactions() {

  const t = useTranslations();
  const [transactionRes, setTransactionRes] = useState<IResponce | undefined>(undefined);
  const [transactionsList, setTransactionsList] = useState<ITransaction[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState<boolean>(false);
  const [isSearchingForRecipient, setIsSearchingForRecipient] = useState<boolean>(false);
  const account = useSelector((state: GlobalState) => state.account);
  const transactions = useSelector((state: GlobalState) => state.transactions);
  const [newTransaction, setNewTransaction] = useState<ITransaction>({
    id: uuidv4(),
    date: new Date().toISOString(),
    description: '',
    type: 'send',
    amount: 0,
    recipientId: '',
    recipientName: '',
    senderId: account.id ?? '',
    senderName: account.name,
  });
  const [recipientInfo, setRecipientInfo] = useState<{ id: string, name: string, currency: Currency } | undefined>(undefined);
  const [recipientSerchError, setRecipientSerchError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!account.id) {
      redirect('/login');
    }
  }, [account]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/transactions/${account.id}`);
        const trans: ITransaction[] = await res?.json()
        setTransactionsList(trans);
        dispatch(setTransactions(trans));
        setTransactionRes({
          type: 'success',
          title: t('common.success'),
          description: t('transactions.transactionSuccess')
        })
        setIsLoading(false);
      }
      catch (error) {
        console.error(error);
        setTransactionRes({
          type: 'error',
          title: t('common.somethingWentWrong'),
          description: t('transactions.transactionFailed'),
        })
      }
      setIsLoading(false);
    }
    )();
  }, [account, t, dispatch]);

  useEffect(() => {
    if (recipientInfo) {
      setNewTransaction(prev => ({ ...prev, recipientId: recipientInfo.id, recipientName: recipientInfo.name }))
    }
  }, [recipientInfo])

  useEffect(() => {
    setTransactionsList(transactions ?? []);
  }, [transactions])

  // Debounce logic for recipient name input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (newTransaction.recipientName) {
        getRecipientInfo(newTransaction.recipientName);
      }
    }, 500); // 500ms delay after typing stops

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout if the component unmounts or input changes
  }, [newTransaction.recipientName]); // Re-run the effect when recipientName changes

  const getRecipientInfo = async (recipientName: string) => {
    setIsSearchingForRecipient(true);
    setRecipientSerchError(undefined);
    try {
      const res = await fetch(`http://localhost:3000/api/users?name=${recipientName}`, { method: 'GET' });
      const user = await res?.json();
      if (user && user.id !== account.id) {
        setRecipientInfo({ id: user.id, name: user.name, currency: user.currency });
      }
      else {
        setRecipientSerchError(t('transactions.recipientNotFound'));
      }
    }
    catch (error) {
      console.error(error);
    }
    setIsSearchingForRecipient(false);
  }

  // Handling the form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setTransactionRes(undefined);
      setIsNewTransactionModalOpen(false);
      setIsLoading(true);

      const res = await fetch(`http://localhost:3000/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await res.json();

      if (data) {
        dispatch(setAccount({ ...account, balance: account.balance - newTransaction.amount }));
        dispatch(setTransactions(transactionsList ? [...transactionsList, newTransaction] : [newTransaction]));
        setIsLoading(false);

        setTransactionRes({
          type: 'success',
          title: t('common.success'),
          description: t('transactions.transactionSuccess'),
        });
      }
      else {
        setTransactionRes({
          type: 'error',
          title: t('common.somethingWentWrong'),
          description: t('transactions.transactionFailed'),
        })
        setIsLoading(false);
      }
    }
    catch (error) {
      console.error(error);
      setTransactionRes({
        type: 'error',
        title: t('common.somethingWentWrong'),
        description: t('transactions.transactionFailed'),
      })
      setIsLoading(false);
    }

  };

  const isSubmitDisabled = (): boolean => {
    if (!newTransaction.recipientName || !newTransaction.amount || !recipientInfo || recipientInfo.id === account.id) {
      return true;
    };

    if (newTransaction.amount > account.balance) {
      return true;
    }

    if (newTransaction?.amount <= 0) {
      return true;
    }

    if (recipientSerchError || isSearchingForRecipient) {
      return true;
    }

    return false;

  }

  const onMessagePopupClose = () => {
    setTransactionRes(undefined);
  }

  const onModalClose = () => {
    setIsNewTransactionModalOpen(prev => !prev);
    setNewTransaction({
      id: uuidv4(),
      date: new Date().toISOString(),
      description: '',
      type: 'send',
      amount: 0,
      recipientId: '',
      recipientName: '',
      senderId: account.id ?? '',
      senderName: account.name,
    });
    setRecipientInfo(undefined);
    setRecipientSerchError(undefined);
  }

  return (
    <div className={'page'}>
      <div className={styles.transactionContainer}>
        {
          !isLoading &&
          <>
            <h1 className={styles.title}>{t('transactions.title')}</h1>
            {
              transactionsList &&
              <div className={styles.transactionsContainer}>
                <TransactionsList transactions={transactionsList} />
              </div>
            }

            <div className={styles.buttonContainer}>
              <Button
                label={t('transactions.newTransaction')}
                disabled={isNewTransactionModalOpen}
                onClick={() => setIsNewTransactionModalOpen(prev => !prev)}
                type="button"
              />
            </div>
          </>
        }
        <Modal isOpen={isNewTransactionModalOpen} closeModal={onModalClose}>
          <h2 className={styles.modalHeader}>{t('transactions.newTransaction')}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              id={'recipientName'}
              label={t('transactions.recipientName')}
              type="text"
              required
              name={'recipientName'}
              value={newTransaction.recipientName}
              placeholder={t('transactions.recipientNamePlaceholder')}
              onChange={(e) => setNewTransaction({ ...newTransaction, recipientName: e.target.value })}
              showSpinner={isSearchingForRecipient}
              error={recipientSerchError}
            />
            <TextField
              id={'description'}
              label={t('transactions.descriptionPlaceholder')}
              type="text"
              name={'description'}
              value={newTransaction?.description ?? ''}
              placeholder={t('transactions.descriptionPlaceholder')}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            />
            <TextField
              id={'amount'}
              label={t('transactions.amount')}
              type="number"
              required
              name={'amount'}
              value={newTransaction?.amount?.toString() ?? ''}
              placeholder={t('transactions.amountPlaceholder')}
              onChange={(e) => {
                const val = +e.target.value < 0 ? 0 : +e.target.value;
                setNewTransaction({ ...newTransaction, amount: val })
              }}
            />
            <h2 className={styles.balanceLeft}>Balance left: <p>{account?.balance - newTransaction?.amount} {getCurrencySymbol(account.currency)}</p></h2>

            {
              recipientInfo && (recipientInfo?.currency !== account.currency) &&
              <h2 className={styles?.converMessage}>{t('transactions.convert')} <p>{convertCurrency(newTransaction?.amount, account?.currency, recipientInfo?.currency)} {getCurrencySymbol(recipientInfo?.currency)}</p></h2>
            }
            <Button
              label={t('transactions.send')}
              type="submit"
              disabled={isSubmitDisabled()}
            />
          </form>
        </Modal>

        {
          isLoading &&
          <Spinner isGlobalSpinner label={transactionRes?.type === 'success' ? transactionRes?.description : t('transactions.loading')} size={35} />
        }
        {
          transactionRes?.type === 'error' &&
          <MessagePopup
            type={transactionRes.type}
            title={transactionRes.title}
            description={transactionRes.description}
            onClose={onMessagePopupClose}
          />
        }
      </div>
    </div>
  );
}
