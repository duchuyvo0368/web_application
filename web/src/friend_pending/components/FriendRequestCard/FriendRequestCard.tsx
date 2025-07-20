/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import styles from './FriendRequestCard.module.css';
import { acceptFriendRequest, rejectFriendRequest } from '../../services/friend_request.service';

interface FriendCardProps {
    userId: string;
    name: string;
    img: string;
    mutual: string;
    followers?: string;
    onAccept?: () => void;
    onReject?: () => void;
    onUnaccept?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
    userId,
    name,
    img,
    mutual,
    followers = '0 followers',
    onAccept,
    onReject,
    onUnaccept,
}) => {
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);
    console.log('FriendCard rendered with requestId:', userId);
    const handleAccept = async () => {
        try {
            await acceptFriendRequest({
                userId,
                onSuccess: (res) => {
                    console.log('Chấp nhận thành công:', res);
                },
                onError: (err) => {
                    console.error('Lỗi khi chấp nhận:', err);
                },
            });            
            setAccepted(true);
            onAccept?.();
        } catch (err) {
            console.error('Lỗi khi chấp nhận kết bạn:', err);
        }
    };
    
    

    const handleReject = async () => {
        try {
            await rejectFriendRequest({
                userId,
                onSuccess: (res) => {
                    console.log('Đã từ chối yêu cầu kết bạn:', res);
                },
                onError: (err) => {
                    console.error('Lỗi khi từ chối yêu cầu kết bạn:', err);
                }
            });
            setRejected(true);
            onReject?.();
        }
        catch (err) {
            console.error('Lỗi khi từ chối yêu cầu kết bạn:', err);
        }
        
    };

    const handleUnaccept = () => {
        setAccepted(false);
        onUnaccept?.();
    };

    if (rejected) {
        return <div className={styles.friendCard}>❌ You rejected {name}'s request.</div>;
    }

    return (
        <div className={styles.friendCard}>
            <img src={img} alt={name} className={styles.friendAvatar} />
            <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{name}</h3>
                <p className={styles.friendMutual}>{mutual}</p>
                <p className={styles.followerCount}>{followers}</p>

                <div className={styles.buttonGroup}>
                    {!accepted ? (
                        <>
                            <button
                                className={styles.actionButton}
                                onClick={handleAccept}
                            >
                                Accept
                            </button>
                            <button
                                className={styles.actionButton}
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <button
                            className={`${styles.actionButton} ${styles.activeButton}`}
                            onClick={handleUnaccept}
                        >
                            ✓ Accepted 
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendCard;


