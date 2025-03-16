'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ImageInput.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Spinner from '../Spinner/Spinner';
import { compressImageHelper } from '@/helpers/compressImageHelper';

interface ImageUploaderProps {
  value?: string; // Base64 string of the image
  onImageUpload?: (base64: string | undefined) => void; // Callback function to return the Base64 string
  size?: number; // Size of the image in pixels
  className?: string;
}

const imageSrcPrefix = 'data:image/png;base64,';

const ImageInput: React.FC<ImageUploaderProps> = ({ value, size, className, onImageUpload }) => {
  const t = useTranslations();
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      compressImageHelper(file, (compressedBase64) => {
        compressedBase64 = compressedBase64.split(",")[1];
        setPreview(compressedBase64);
        onImageUpload?.(compressedBase64); // Pass the Base64 string to the parent
        setUploadingImage(false);
      });
    }
  };

  // Handle removing the image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering file selection
    setPreview(undefined);
    onImageUpload?.(undefined); // Notify parent that the image is removed
  };

  const handleImageClick = () => {
    if (onImageUpload) {
      fileInputRef.current?.click();
    }
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
      <div className={`${styles.imageWrapper} ${onImageUpload ? '' : styles.notClickable} ${preview ? styles.solidBorder : ''}`} onClick={handleImageClick}>
        {uploadingImage && (
          <div className={styles.spinnerWrapper}>
            <Spinner size={50} />
          </div>
        )}

        {!uploadingImage && preview ? (
          <>
            {
              onImageUpload &&
              <button className={styles.removeIcon} onClick={handleRemoveImage}>
                ✖
              </button>

            }
            <Image
              src={imageSrcPrefix + preview}
              alt="Preview"
              className={styles.preview}
              priority
              width={size ?? 150}
              height={size ?? 150}
            />
            <Image
              src={'/update.svg'}
              alt="Edit"
              className={styles.editLogo}
              priority
              width={size ?? 150}
              height={size ?? 150}
            />
          </>
        ) : (
          <div className={styles.placeholder}>
            <Image src="/addImage.svg" alt="Upload Image" width={35} height={35} />
            <p>{t('fields.imgInputLabel')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
