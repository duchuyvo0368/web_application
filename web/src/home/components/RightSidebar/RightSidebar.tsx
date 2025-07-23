import React from 'react';
import styles from './RightSidebar.module.css';

const RightSidebar: React.FC = () => (
    <div className={styles.sidebarWrapper}>
        <div className={styles.sidebarBox}>
            <b>Additional Info</b>
            <div>Friend suggestions, ads, ...</div>
        </div>
    </div>
);

export default RightSidebar; 