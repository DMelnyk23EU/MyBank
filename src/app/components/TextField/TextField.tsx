'use client';

import React, { useState, useEffect } from 'react';
import styles from './TextField.module.scss';
import { useTranslations } from 'next-intl';

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const TextField: React.FC<FormInputProps> = ({ label, type, id, name, value, required, placeholder, onChange, error }) => {
  const [touched, setTouched] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (touched) {
      setShowRequiredError(required && !value);
    }
  }, [value, touched, required]);

  return (
    <div className={styles.formGroup}>
      <label className={`${styles.textFieldLabel} ${required ? styles.required : ''}`} htmlFor={id}>
        {label}
      </label>
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
      {/* Smooth show and hide error message */}
      <p className={`${styles.error}  ${(error || showRequiredError) && styles.visible}`}>{error ?? t('validations.required')}</p>
    </div>
  );
};

export default TextField;
