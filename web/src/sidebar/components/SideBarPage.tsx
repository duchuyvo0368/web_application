import React from 'react';

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
    <nav className="p-4 bg-white rounded-lg shadow-md h-full">
      <h3 className="font-bold mb-4">Sidebar</h3>
      <ul>
        <li
          onClick={() => onSelect(0)}
          className={`cursor-pointer p-2 rounded ${activeTab === 0 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          Home
        </li>
        <li
          onClick={() => onSelect(1)}
          className={`cursor-pointer p-2 rounded ${activeTab === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          Profile
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;