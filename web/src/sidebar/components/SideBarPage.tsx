import React from 'react';
import styles from './SideBarPage.module.css';
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import BrushIcon from '@mui/icons-material/Brush';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LayersIcon from '@mui/icons-material/Layers';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/router';

interface SidebarProps {
  activeTab: number;
  onSelect: (tab: number) => void;
  menu?: { label: string; icon: React.ReactNode }[];
}

const menuHome = [
  { label: 'Home', icon: <HomeIcon fontSize="small" style={{ marginRight: 8, color: '#00bfff' }} /> },
  { label: 'Friends', icon: <DesignServicesIcon fontSize="small" style={{ marginRight: 8, color: '#3f51b5' }} /> },
  { label: 'My Store', icon: <StoreMallDirectoryIcon fontSize="small" style={{ marginRight: 8, color: '#2196f3' }} /> },
  { label: 'Community', icon: <Diversity3Icon fontSize="small" style={{ marginRight: 8, color: '#1976d2' }} /> },
  { label: 'Digital Yearbook Exhibition', icon: <BrushIcon fontSize="small" style={{ marginRight: 8, color: '#795548' }} /> },
  { label: 'Profile', icon: <PersonIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} /> },
  { label: 'Connections', icon: <PeopleAltIcon fontSize="small" style={{ marginRight: 8, color: '#00bcd4' }} /> },
  { label: 'Features', icon: <SettingsIcon fontSize="small" style={{ marginRight: 8, color: '#4caf50' }} /> },
  { label: 'Old Memories', icon: <HistoryEduIcon fontSize="small" style={{ marginRight: 8, color: '#f44336' }} /> },
  { label: 'Feeling & Moments', icon: <EmojiEmotionsIcon fontSize="small" style={{ marginRight: 8, color: '#2196f3' }} /> },
  { label: 'Coming soon', icon: <NewReleasesIcon fontSize="small" style={{ marginRight: 8, color: '#00e676' }} /> },
  { label: 'Life Utilities', icon: <AppsRoundedIcon fontSize="small" style={{ marginRight: 8, color: '#00bcd4' }} /> },
  { label: 'Brain Funny', icon: <PsychologyIcon fontSize="small" style={{ marginRight: 8, color: '#e91e63' }} /> },
  { label: 'Channel', icon: <LiveTvIcon fontSize="small" style={{ marginRight: 8, color: '#2196f3' }} /> },
  { label: 'Others', icon: <LayersIcon fontSize="small" style={{ marginRight: 8, color: '#ff9800' }} /> },
  { label: 'Event Report May 2024', icon: <DescriptionIcon fontSize="small" style={{ marginRight: 8, color: '#ffc107' }} /> },
];

const BannerPage: React.FC<SidebarProps> = ({ activeTab, onSelect, menu }) => {
  const menuToRender = menu || menuHome;
  const router = useRouter();
  return (
    <div className={styles.wrapper}>
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
        {menuToRender.map((item, idx) => (
          <div
            key={item.label}
            onClick={() => {
              if (idx === 0) {
                router.push('/');
                onSelect(idx); // Thêm dòng này
              } else if (idx === 1) {
                router.push('/friends');
                onSelect(idx); // Thêm dòng này
              } else {
                onSelect(idx);
              }
            }}
            className={
              activeTab === idx
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : styles.menuItem
            }
            style={{ justifyContent: 'flex-start' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerPage; 