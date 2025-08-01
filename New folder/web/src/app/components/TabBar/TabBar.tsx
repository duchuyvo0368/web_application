import React from 'react';
import Badge from '@mui/material/Badge';

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
    <div className="flex w-full border-b border-gray-200 bg-white shadow-sm">
      {tabList.map((tab, idx) => (
        <div
          key={tab.label}
          onClick={() => onSelect && onSelect(idx)}
          className={`flex-1 text-center cursor-pointer py-2 text-sm font-medium transition-colors duration-200
            ${
              activeTab === idx
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-500'
            }`}
        >
          {tab.badge !== undefined ? (
            <Badge badgeContent={tab.badge} color="error">
              <span>{tab.label}</span>
            </Badge>
          ) : (
            <span>{tab.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};


export default TabBar;
