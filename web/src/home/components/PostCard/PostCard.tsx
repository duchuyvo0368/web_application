import React from 'react';
import styles from './PostCard.module.css';
import LinkPreviewSkeleton from './LinkPreviewSkeleton';

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
    post_link_meta?: {
        url: string;
        title: string;
        description: string;
        image: string;
        _id?: string;
    };
}

const isVideo = (url: string) => {
    return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));
};

const formatHashtags = (text: string) => {
    if (!text) return '';
    return text.replace(/(#[a-zA-Z0-9_À-ỹ]+)/g, '<span class="hashtag">$1</span>');
};

const PostCard: React.FC<PostCardProps & { isMetaLoading?: boolean }> = ({
    avatar, username, time, title, content, image, stats, post_link_meta, isMetaLoading
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
            {/* Hiển thị content với hashtag màu xanh */}
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: formatHashtags(content) }}
            />
            {isMetaLoading ? (
                <LinkPreviewSkeleton />
            ) : post_link_meta && (
                <a
                    href={post_link_meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkPreview}
                >
                    <div className={styles.linkPreviewImageWrapper}>
                        <img src={post_link_meta.image} alt={post_link_meta.title} className={styles.linkPreviewImage} />
                    </div>
                    <div className={styles.linkPreviewContent}>
                        <div className={styles.linkPreviewTitle}>{post_link_meta.title}</div>
                        <div className={styles.linkPreviewDesc}>{post_link_meta.description}</div>
                        <div className={styles.linkPreviewUrl}>{post_link_meta.url}</div>
                    </div>
                </a>
            )}
            {(!post_link_meta && image) && (
                isVideo(image) ? (
                    <video src={image} controls className={styles.image} />
                ) : (
                    <img src={image} alt="post" className={styles.image} />
                )
            )}
            <div className={styles.metadata}>
                <span>{stats.like} lượt thích</span>
                <span>{stats.comment} bình luận</span>
                <span>{stats.view} lượt xem</span>
            </div>
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