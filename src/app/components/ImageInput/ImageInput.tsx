'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ImageInput.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ImageUploaderProps {
  value?: string; // Base64 string of the image
  onImageUpload?: (base64: string | undefined) => void; // Callback function to return the Base64 string
  size?: number; // Size of the image in pixels
  className?: string;
}

const ImageInput: React.FC<ImageUploaderProps> = ({ value, size, className, onImageUpload }) => {

  const t = useTranslations();
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
    console.log('value: ', value);

  }, [value]);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload?.(base64String); // Pass the Base64 string to the parent
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageUpload?.(undefined); // Notify parent that the image is removed
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${styles.imageUploader} ${className}`}>
      <input
        ref={fileInputRef}
        className={styles.inputField}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple={false}
      />
      {/* Clickable Image Preview or Placeholder */}
      <div className={`${styles.imageWrapper} ${preview ? styles.solidBorder : ''}`} onClick={handleImageClick}>
        {preview ? (
          <>
            <Image src={preview} alt="Preview" className={styles.preview} priority width={size ?? 150} height={size ?? 150} />
            <Image src={'/update.svg'} alt="Edit" className={styles.editLogo} priority width={size ?? 150} height={size ?? 150} />
          </>
        ) : (
          <div className={styles.placeholder}>
            <Image src="/addImage.svg" alt="Upload Image" width={35} height={35} />
            <p>{t('fields.imgInputLabel')}</p>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {preview && onImageUpload && (
        <button onClick={handleRemoveImage} className={styles.removeButton}>
          Remove
        </button>
      )}
    </div>
  );
};

export default ImageInput;
