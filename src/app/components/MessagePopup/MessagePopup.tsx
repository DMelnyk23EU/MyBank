import React from "react";
import styles from "./MessagePopup.module.scss";
import Button from "../Button/Button";
import { useTranslations } from "next-intl";

// Define types for the props
interface MessagePopupProps {
  type: 'error' | 'success';
  title: string | undefined;
  description: string | undefined;
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ type, title, description, onClose }) => {

  const t = useTranslations();

  const icon =
    type === "error"
      ? "❌"
      : "✅";

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${styles[type]}`}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.content}>
          { title && <h2 className={styles.title}>{title}</h2> }
          { description && <p className={styles.description}>{description}</p> }
        </div>
        <div className={styles.buttonContainer}>
          <Button type={'button'}
            disabled={false}
            label={t('common.ok')}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
