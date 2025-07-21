import React from 'react';
import styles from './PostCard.module.css';

interface PostCardProps {
    avatar: string;
    username: string;
    time: string;
    title: string;
    content: string;
    image: string;
    stats: {
        like: number;
        star: number;
        comment: number;
        view: number;
    };
}

const PostCard: React.FC<PostCardProps> = ({
    avatar, username, time, title, content, image, stats
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <img src={avatar} alt="avatar" className={styles.avatar} />
                <div>
                    <div className={styles.username}>{username}</div>
                    <div className={styles.time}>{time}</div>
                </div>
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{content}</div>
            <img src={image} alt="post" className={styles.image} />
            <div className={styles.stats}>
                <span>❤️ {stats.like}</span>
                <span>⭐ {stats.star}</span>
                <span>💬 {stats.comment}</span>
                <span>👁️ {stats.view}</span>
            </div>
            <div className={styles.actions}>
                <button>Like</button>
                <button>Badge</button>
                <button>Feel</button>
                <button>Share</button>
            </div>
        </div>
    );
};

export default PostCard; 