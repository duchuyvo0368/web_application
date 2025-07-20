import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { profile, uploadFile } from '../../services/user.service';

interface ProfileProps {
  userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<{ name: string; avatar?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = () => {
    profile({
      userId,
      onSuccess: (data) => setUser(data.metadata.user),
      onError: (err) => console.error('Load profile failed:', err),
    });
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    uploadFile({
      type: 'avatar',
      file,
      onSuccess: (data) => {
        const newAvatarUrl = data.metadata.url;

        // ✅ Cập nhật avatar trong state và localStorage
        setUser((prev) => {
          if (!prev) return prev;

          const updatedUser = { ...prev, avatar: newAvatarUrl };

          try {
            const stored = localStorage.getItem('userInfo');
            if (stored) {
              const parsed = JSON.parse(stored);
              parsed.avatar = newAvatarUrl;
              localStorage.setItem('userInfo', JSON.stringify(parsed));
            }
          } catch (e) {
            console.error('Failed to update localStorage avatar:', e);
          }

          // ✅ Gửi sự kiện avatarUpdated để component khác có thể nghe và cập nhật
          window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: newAvatarUrl }));

          return updatedUser;
        });

        setLoading(false);
      },
      onError: (err) => {
        console.error('Upload avatar failed:', err);
        alert('Tải ảnh thất bại!');
        setLoading(false);
      },
    });
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.coverWrap}>
        <img
          src="https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd--1000.png"
          alt="cover"
          className={styles.coverImg}
        />
      </div>
      <div className={styles.avatarWrap}>
        <img src={user.avatar} alt="avatar" className={styles.avatar} />
        <label className={styles.uploadIcon}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <CameraAltIcon fontSize="medium" />
        </label>
        {loading && <div className={styles.uploading}>Uploading...</div>}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>
          {user.name}
          <svg className={styles.verified} width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#2196f3" />
            <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.email}>{user.email}</span>
        <div className={styles.bio}>This is a placeholder for user bio and other profile info.</div>
      </div>
    </div>
  );
};

export default Profile;
