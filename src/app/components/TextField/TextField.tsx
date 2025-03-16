import React, { useState, useEffect } from 'react';
import styles from './TextField.module.scss';
import { useTranslations } from 'next-intl';
import Spinner from '../Spinner/Spinner';

interface FormInputProps {
  label?: string;
  type: string;
  id: string;
  name: string;
  value: string;
  required?: boolean;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showSpinner?: boolean;
}

const TextField: React.FC<FormInputProps> = ({ label, type, id, name, value, required, placeholder, onChange, showSpinner, error }) => {
  const [touched, setTouched] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (touched) {
      setShowRequiredError(required === true && !value);
    }
  }, [value, touched, required]);

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={`${styles.textFieldLabel} ${required ? styles.required : ''}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
          onBlur={() => setTouched(true)}
          required={required}
          placeholder={placeholder}
        />
        {/* Show loading spinner */}
        <Spinner className={`${styles.spinner} ${showSpinner && styles.visible}`} size={20} />
      </div>
      {/* Smooth show and hide error message */}
      <p className={`${styles.error} ${(error || showRequiredError) && styles.visible}`}>{error ?? t('validations.required')}</p>
    </div>
  );
};

export default TextField;
