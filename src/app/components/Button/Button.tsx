import styles from './Button.module.scss';

interface IButtonProps {
  label: string;
  disabled: boolean;
  onClick?: () => void;
  type: 'button' | 'submit' | 'reset';
}

const Button: React.FC<IButtonProps> = ({ label, onClick, disabled, type }) => {

  return (
    <button type={type} className={styles.button} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button;
