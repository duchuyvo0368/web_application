import React from 'react';
import styles from './PostCard.module.css';

const LinkPreviewSkeleton: React.FC = () => (
  <div className={styles.linkPreview}>
    <div className={styles.linkPreviewImageWrapper}>
      <div className={styles.skeletonImage} />
    </div>
    <div className={styles.linkPreviewContent}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonDesc} />
      <div className={styles.skeletonUrl} />
    </div>
  </div>
);

export default LinkPreviewSkeleton; 