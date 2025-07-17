import React from 'react';
import Badge from '@mui/material/Badge';
import styles from './TabBar.module.css';


const tabList = [
    { label: 'All', badge: 1 },
    { label: 'Suggestions' },
    { label: 'Friend Requests', badge: 45 },
    { label: 'Following', badge: 0 },
    { label: 'Sent Requests' },
];

interface TabBarProps {
    activeTab: number | null;
    onSelect: ((idx: number) => void) | null;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelect }) => {
    return (
        <div className={styles.tabBar}>
            {tabList.map((tab, idx) => (
                <div
                    key={tab.label}
                    onClick={() => onSelect && onSelect(idx)}
                    className={
                        activeTab === idx
                            ? `${styles.tabItem} ${styles.active}`
                            : styles.tabItem
                    }
                >
                    {tab.badge !== undefined ? (
                        <Badge badgeContent={tab.badge} color="error">
                            <span className={styles.badgeSpan}>{tab.label}</span>
                        </Badge>
                    ) : (
                        <span className={styles.badgeSpan}>{tab.label}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TabBar;