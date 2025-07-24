import React, { useRef, useState, useEffect } from 'react';
import styles from './PostCard.module.css';
import LinkPreviewSkeleton from './LinkPreviewSkeleton';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

interface PostCardProps {
    avatar: string;
    user: [string, string]; // [id, name]
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
    avatar, user, time, title, content, image, stats, post_link_meta, isMetaLoading
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [image]);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <img src={avatar} alt="avatar" className={styles.avatar} />
                <div>
                    <div className={styles.username}>{user[1]}</div>
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
                    <div style={{ position: 'relative' }}>
                        <video
                            src={image}
                            className={styles.image}
                            ref={el => {
                                videoRef.current = el;
                                if (el) {
                                    (window as any)[`video_${image}`] = el;
                                }
                            }}
                        />
                        <div className={styles.videoControlsBar}>
                            <button
                                className="plyr__controls__item plyr__control"
                                type="button"
                                aria-pressed="false"
                                title="Tua lùi 10s"
                                onClick={e => {
                                    e.stopPropagation();
                                    const video = videoRef.current;
                                    if (video) video.currentTime = Math.max(0, video.currentTime - 10);
                                }}
                            >
                                <Replay10Icon fontSize="medium" />
                            </button>
                            <button
                                className="plyr__controls__item plyr__control"
                                type="button"
                                aria-pressed="false"
                                title={isPlaying ? 'Dừng video' : 'Phát video'}
                                onClick={e => {
                                    e.stopPropagation();
                                    const video = videoRef.current;
                                    if (!video) return;
                                    if (isPlaying) {
                                        video.pause();
                                    } else {
                                        video.play();
                                    }
                                }}
                            >
                                {isPlaying ? (
                                    <PauseCircleFilledIcon fontSize="large" />
                                ) : (
                                    <PlayCircleFilledIcon fontSize="large" />
                                )}
                            </button>
                            <button
                                className="plyr__controls__item plyr__control"
                                type="button"
                                aria-pressed="false"
                                title="Tua tới 10s"
                                onClick={e => {
                                    e.stopPropagation();
                                    const video = videoRef.current;
                                    if (video) video.currentTime = Math.min(video.duration, video.currentTime + 10);
                                }}
                            >
                                <Forward10Icon fontSize="medium" />
                            </button>
                            <button
                                className="plyr__controls__item plyr__control"
                                type="button"
                                aria-pressed="false"
                                title="Cài đặt video"
                                onClick={e => {
                                    e.stopPropagation();
                                    alert('Video settings coming soon!');
                                }}
                            >
                                <SettingsIcon fontSize="medium" />
                            </button>
                        </div>
                    </div>
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