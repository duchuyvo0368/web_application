import React from 'react';
import styles from './Profile.module.css';

interface ProfileProps {
    user: {
        name: string;
        avatar?: string;
        email?: string;
    };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.coverWrap}>
                <img src="https://file.apetavers.com/api/files/admin/20241226/3d48b567-fd61-415d-a2bc-aa09966a05cd--1000.png" alt="cover" className={styles.coverImg} />
            </div>
            <div className={styles.avatarWrap}>
                <img src={user.avatar} alt="avatar" className={styles.avatar} />
            </div>
            <div className={styles.info}>
                <span className={styles.name}>
                    {user.name}
                    <svg className={styles.verified} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 6, verticalAlign: 'middle' }}>
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
