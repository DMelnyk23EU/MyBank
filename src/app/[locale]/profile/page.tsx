'use client';

import styles from './profile.module.scss';
import { useSelector } from "react-redux";
import { GlobalState } from '@/store/GlobalStore';

import ImageInput from '@/app/components/ImageInput/ImageInput';

export default function Profile() {
  // const dispatch = useDispatch();
  const account = useSelector((state: GlobalState) => state.account);



  return (
    <div className={'page'}>
      <div className={styles.mainContent}>
        <ImageInput className={styles.img} value={account?.profilePicture} size={50} />
        <div className={styles.info}>
          <h2>{account?.name}</h2>
          <p>{account?.email}</p>
        </div>
      </div>

    </div>
  );
}
