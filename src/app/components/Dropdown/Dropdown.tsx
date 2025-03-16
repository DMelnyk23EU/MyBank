import React from 'react';
import styles from './Dropdown.module.scss';

interface IDropdownProps {
  label: string;
  options: { key: string; label: string, icon?: string }[]; // Array of { value, label } pairs
  selectedValue: string;
  onChange: (value: string) => void; // Function to handle selection change
}

const Dropdown: React.FC<IDropdownProps> = ({ label, options, selectedValue, onChange }) => {

  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.dropdown}
        value={selectedValue}
        onChange={(e) => {
          const key = options?.find((option) => option.label === e.target.value)?.key;
          onChange(key ?? ''); // Notify the parent component about the change
        }}
      >
        {options.map((option) => (
          <option key={option.key} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
