// Modal.tsx
import React from 'react';
import styles from './Modal.module.scss';

interface IModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModalProps> = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
