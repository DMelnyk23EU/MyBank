// app/components/UserProfile/UserProfile.tsx

import { FC } from 'react';
import styles from './UserProfile.module.scss';
import Image from 'next/image';

// Defining the types for the props passed to the UserProfile component
interface IUserProfileProps {
  profilePicture: string;
  name: string;
  email: string;
}

const UserProfile: FC<IUserProfileProps> = ({ profilePicture, name, email }) => {

  return (
    <div className={styles.profileContainer}>
      {
        profilePicture?.length > 0 &&
        <Image
          src={'data:image/png;base64,' + profilePicture}
          alt="Avatar"
          priority
          width={120}
          height={120}
          className={styles.img}
        />
      }
      <div className={styles.info}>
        <div className={styles.valueContainer}>
          <h2>{name}</h2>
        </div>
        <div className={styles.valueContainer}>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
