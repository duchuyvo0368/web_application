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
  const [relation, setRelation] = useState<string | null>(null);

  const fetchProfile = () => {
    profile({
      userId,
      onSuccess: (data) => {
        setUser(data.metadata.user)
        setRelation(data.metadata.relation);
      },
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

  // Thêm các biến đếm giả định (hoặc lấy từ props/data nếu có)
  const followingCount = 0;
  const followerCount = 0;
  const friendCount = 0;

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
        {relation === 'me' && (
          <label className={styles.uploadIcon}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <CameraAltIcon fontSize="medium" />
          </label>
        )}
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
      {/* Khối số lượng ở giữa dưới avatar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px 0',
        gap: 24
      }}>
        <div style={{ padding: '8px 18px', minWidth: 70, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{followingCount}</div>
          <div style={{ fontSize: 13, color: '#1976d2' }}>Following</div>
        </div>
        <div style={{ padding: '8px 18px', minWidth: 70, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{followerCount}</div>
          <div style={{ fontSize: 13, color: '#1976d2' }}>Follower</div>
        </div>
        <div style={{ padding: '8px 18px', minWidth: 70, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{friendCount}</div>
          <div style={{ fontSize: 13, color: '#43a047' }}>Bạn bè</div>
        </div>
      </div>

      {/* Nút chỉ hiện nếu không phải là me */}
      {relation !== 'me' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <button
            style={{
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 28px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => {
              // TODO: Gọi API follow hoặc xử lý logic follow
              console.log('Follow', userId);
            }}
          >
            Follow
          </button>
          <button
            style={{
              background: '#43a047',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 28px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => {
              // TODO: Gọi API gửi kết bạn hoặc xử lý logic thêm bạn
              console.log('Thêm bạn', userId);
            }}
          >
            Thêm bạn
          </button>
        </div>
      )}

    </div>
  );
};

export default Profile;
