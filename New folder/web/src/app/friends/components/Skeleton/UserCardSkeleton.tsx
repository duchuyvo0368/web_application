import React from 'react';

const UserCardSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-lg shadow p-4 animate-pulse flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-8 bg-gray-200 rounded" />
        </div>
    );
};

export default UserCardSkeleton;
