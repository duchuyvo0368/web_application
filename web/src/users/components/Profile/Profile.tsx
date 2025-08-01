import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useRouter } from 'next/router';
import { getProfile, uploadFile } from '../../services/user.service';

interface ProfileProps {
  userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<{ name: string; avatar?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false); // loading toàn profile
  const [followLoading, setFollowLoading] = useState(false); // loading riêng cho follow/unfollow
  const [relation, setRelation] = useState<string | null>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getProfile({
        userId,
        onSuccess: (data: any) => {
          setUser(data.metadata.user);
          setRelation(data.metadata.relation);
          setFollowingCount(data.metadata.followingCount || 0);
          setFollowerCount(data.metadata.followersCount || 0);
          setFriendCount(data.metadata.countFriends || 0);
          setIsFollowing(data.metadata.isFollowing || false);
          setLoading(false);
        },
        onError: (err: any) => {
          console.error('Load profile failed:', err);
          setLoading(false);
        },
      });
    }
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

  // Nút động theo relation và isFollowing
  const handleAddFriend = () => {
    // addFriend với type 'send'
    setFriendLoading(true);
    import('../../services/user.service').then(({ addFriend }) => {
      addFriend({
        userId,
        type: 'send',
        onSuccess: () => {
          setRelation('pending_sent');
          setFriendLoading(false);
        },
        onError: () => setFriendLoading(false)
      });
    });
  };
  const handleAcceptFriend = () => {
    setFriendLoading(true);
    import('../../services/user.service').then(({ addFriend }) => {
      addFriend({
        userId,
        type: 'accept',
        onSuccess: () => {
          setRelation('accepted');
          setFriendLoading(false);
        },
        onError: () => setFriendLoading(false)
      });
    });
  };
  const handleCancelRequest = () => {
    setFriendLoading(true);
    import('../../services/user.service').then(({ cancelRequest }) => {
      cancelRequest({
        userId,
        onSuccess: () => {
          setRelation('stranger');
          setFriendLoading(false);
        },
        onError: () => setFriendLoading(false)
      });
    });
  };
  const handleUnFriend = () => {
    setFriendLoading(true);
    import('../../services/user.service').then(({ unFriend }) => {
      unFriend({
        userId,
        onSuccess: () => {
          setRelation('stranger');
          setFriendLoading(false);
        },
        onError: () => setFriendLoading(false)
      });
    });
  };
  const handleFollow = () => {
    setFollowLoading(true);
    import('../../services/user.service').then(({ addFollow }) => {
      addFollow({
        userId,
        onSuccess: () => {
          setIsFollowing(true);
          setFollowingCount((prev) => prev + 1);
          setFollowLoading(false);
        },
        onError: () => setFollowLoading(false)
      });
    });
  };
  const handleUnFollow = () => {
    setFollowLoading(true);
    import('../../services/user.service').then(({ unFollow }) => {
      unFollow({
        userId,
        onSuccess: () => {
          setIsFollowing(false);
          setFollowingCount((prev) => Math.max(0, prev - 1)); // Giảm ngay, không âm
          setFollowLoading(false);
        },
        onError: () => setFollowLoading(false)
      });
    });
  };

  // Skeleton loading component
  const SkeletonProfile = () => (
    <div className={styles.profileContainer}>
      <div className={styles.coverWrap}>
        <div className={styles.skeletonCover} />
      </div>
      <div className={styles.avatarWrap}>
        <div className={styles.skeletonAvatar} />
      </div>
      <div className={styles.skeletonName} />
      <div className={styles.skeletonEmail} />
      <div className={styles.skeletonBio} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '16px 0' }}>
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStat} />
        <div className={styles.skeletonStat} />
      </div>
    </div>
  );

  if (loading || !user) return <SkeletonProfile />;

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
          <div style={{ fontSize: 13, color: '#1976d2' }}>Followers</div>
        </div>
        <div style={{ padding: '8px 18px', minWidth: 70, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{friendCount}</div>
          <div style={{ fontSize: 13, color: '#43a047' }}>Friends</div>
        </div>
      </div>

      {/* Nút chỉ hiện nếu không phải là me */}
      {relation !== 'me' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          {/* Bạn bè */}
          {relation === 'accepted' && (
            <button onClick={handleUnFriend} disabled={friendLoading} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Unfriend</button>
          )}
          {relation === 'pending_sent' && (
            <button onClick={handleCancelRequest} disabled={friendLoading} style={{ background: '#757575', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Cancel Request</button>
          )}
          {relation === 'pending_received' && (
            <button onClick={handleAcceptFriend} disabled={friendLoading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Accept</button>
          )}
          {relation === 'stranger' && (
            <button onClick={handleAddFriend} disabled={friendLoading} style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Add Friend</button>
          )}
          {/* Follow/Unfollow */}
          {isFollowing ? (
            <button onClick={handleUnFollow} disabled={followLoading} style={{ background: '#757575', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Unfollow</button>
          ) : (
            <button onClick={handleFollow} disabled={followLoading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', cursor: 'pointer', fontWeight: 600 }}>Follow</button>
          )}
        </div>
      )}

    </div>
  );
};

export default Profile;
