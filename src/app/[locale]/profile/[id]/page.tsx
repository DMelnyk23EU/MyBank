
import styles from './profile.module.scss';
import UserProfile from '@/app/components/UserProfile/UserProfile';
import Balance from '@/app/components/Balance/Balance';
import { getCurrencySymbol } from '@/helpers/currenciesHelper';
import { notFound } from 'next/navigation';
import TransactionsList from '@/app/components/TransactionsList/TransactionsList';
import { getMessages } from 'next-intl/server';

async function fetchUserById(id: string) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`);

  if (!res.ok) {
    return null; // If the user is not found or an error occurs, return null
  }
  return res.json();
}

async function fetchTransactionsUserById(id: string) {
  const res = await fetch(`http://localhost:3000/api/transactions/${id}`);

  if (!res.ok) {
    return null; // If the user is not found or an error occurs, return null
  }
  return res.json();
}

export default async function Profile({ params }: { params: { id: string } }) {
  const translations = await getMessages();

  const { id } = params;
  const account = await fetchUserById(id);
  const transactions = await fetchTransactionsUserById(account?.id);

  if (!account?.id) {
    notFound();
  }

  return (
    <div className={'page'}>
      <div className={styles.mainContainer}>
        <div className={styles.profileContainer}>
          {
            account &&
            <UserProfile
              profilePicture={account.profilePicture}
              name={account.name}
              email={account.email}
            />
          }
        </div>
        <div className={styles.balanceContainer}>
          <Balance title={translations?.transactions.balance} amount={account.balance ?? 0} currency={getCurrencySymbol(account.currency)} />
        </div>
        <TransactionsList transactions={transactions} />
      </div>

    </div>
  );
}
