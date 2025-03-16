import { ITransaction } from '@/interfaces/ITransaction';
import styles from './TransactionsList.module.scss';
import Transaction from '../Transaction/Transaction';


interface ITransactionsListProps {
  transactions: ITransaction[];
}

const TransactionsList = ({ transactions }: ITransactionsListProps) => {
  return (
    <div className={styles.transactionsList}>
      {transactions.map((transaction, index) => (
        <Transaction
          key={`transaction-${index}`}
          date={transaction.date}
          description={transaction.description}
          type={transaction.type}
          amount={transaction.amount}
          recipientName={transaction.recipientName}
          senderName={transaction.senderName}
        />
      ))}
    </div>
  );
};

export default TransactionsList;
