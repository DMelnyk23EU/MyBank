import { useTranslations } from 'next-intl';
import styles from './Transaction.module.scss';

interface ITransactionProps {
  date: string;
  description: string;
  type: 'send' | 'receive'; // Send or receive transaction
  amount: number;
  recipientName: string;
  senderName: string;
}

const Transaction = ({
  date,
  description,
  type,
  amount,
  recipientName,
  senderName,
}: ITransactionProps) => {

  const t = useTranslations();

  return (
    <div className={`${styles.transactionContainer} ${type === 'receive' ? styles.receive : styles.send}`}>
      <div className={styles.transactionHeader}>
        <span className={styles.transactionType}>
          {type === 'receive' ? t('transactions.received') : t('transactions.sent')}
        </span>
        <span className={styles.amount}>
          {type === 'receive' ? `+${amount}` : `-${amount}`}
        </span>
      </div>

      <div className={styles.transactionUsers}>
        <span className={styles.userName}>{senderName}</span>
        <span className={styles.arrow}>{type === 'receive' ? '←' : '→'}</span>
        <span className={styles.userName}>{recipientName}</span>
      </div>

      <div className={styles.transactionDetails}>
        <span className={styles.date}>{date}</span>
      </div>

      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Transaction;
