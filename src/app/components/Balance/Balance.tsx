import styles from './Balance.module.scss';

// Interface to define the expected props
interface IBalanceProps {
  amount: number;
  currency: string;
  title: string;
}

const Balance: React.FC<IBalanceProps> = ({ amount, title, currency }) => {

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.balanceContainer}>
        <p className={styles.balance}>
          {amount} {currency}
        </p>
      </div>
    </div>
  );
};

export default Balance;
