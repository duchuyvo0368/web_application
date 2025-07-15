import React from 'react';
import Profile from '../../users/components/Profile/Profile';

const mockUser = {
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'john.doe@example.com',
};

const ProfilePage: React.FC = () => {
    return <Profile user={mockUser} />;
};

export default ProfilePage; 