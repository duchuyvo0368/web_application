/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './RequestSentCard.module.css';
import { cancelRequest, getRequestSent } from '../../services/request.sent.service';
import Link from 'next/link';

interface RequestSentCardProps {
    userId: string;
    name: string;
    img: string;
    mutual?: string;
    followersCount?: string;
    onCancel?: () => void;
    onAddFriend?: () => void;
}

const RequestSentCard: React.FC<RequestSentCardProps> = ({
    userId,
    name,
    img,
    mutual,
    followersCount,
    onCancel,
    onAddFriend,
}) => {
    const [cancel, setCancel] = useState(false);
    const [addFriends, setAddFriend] = useState(false);
    console.log('FriendCard rendered with requestId:', userId);
    const handleCancelRequest = async () => {
        try {
            await cancelRequest({
                userId,
                onSuccess: (res) => {
                    console.log('Chấp nhận thành công:', res);
                },
                onError: (err) => {
                    console.error('Lỗi khi chấp nhận:', err);
                },
            });
            setCancel(true);
            onCancel?.();
        } catch (err) {
            console.error('Lỗi khi chấp nhận kết bạn:', err);
        }
    };





    const handleAddFrieds = () => {
        setAddFriend(false);
        onAddFriend?.();
    };

    if (cancel) {
        return <div className={styles.friendCard}>❌ You cancel {name}'s request.</div>;
    }

    return (
        <div className={styles.friendCard}>


            <Link href={`/profile/${userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={img} alt={name} className={styles.friendAvatar} />
                <div className={styles.friendInfo}>
                    <h3 className={styles.friendName}>{name}</h3>
                    <p className={styles.friendMutual}></p>
                    <p className={styles.followerCount}>{followersCount}</p>
                </div>
            </Link>
            <div className={styles.buttonGroup}>
                {!addFriends ? (
                    <>
                        <button
                            className={`${styles.actionButton} ${styles.activeButton}`}
                            onClick={handleCancelRequest}
                        >
                            Delete
                        </button>

                    </>
                ) : (
                    <button
                        className={`${styles.actionButton}`}
                        onClick={handleAddFrieds}
                    >
                        ✓ Add Friend
                    </button>
                )}
            </div>
        </div>


    );
};

export default RequestSentCard;


