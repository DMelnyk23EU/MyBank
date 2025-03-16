// Spinner.tsx
import React from "react";
import styles from "./Spinner.module.scss"; // Import SCSS file
import Image from 'next/image';

export interface ISpinnerProps {
  label?: string;
  size: number;
  isGlobalSpinner?: boolean;
}

const Spinner: React.FC<ISpinnerProps> = ({ size, label, isGlobalSpinner }) => {

  const getSpinner = () => {
    const spinenrCMP = (<div className={styles['spinner-container']}>
      <div className={styles.spinner}>
        <Image src="/spinner.svg" alt="Spinner" width={size} height={size} />
      </div>
      {label && <p>{label}</p>}
    </div>);

    if (isGlobalSpinner) {
      return (
        <div className={styles['spinner-global-container']}>
          {spinenrCMP}
        </div>
      )
    }

    return spinenrCMP;
  };

  return (
    <>
      {
        getSpinner()
      }
    </>
  );
};

export default Spinner;
