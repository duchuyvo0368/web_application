import React, { useState } from 'react';
import FriendsGrid from '../components/Grid/Grid';
import UserGrid from '../../users/components/Grid/Grid';
import styles from './FriendPage.module.css';
import FriendsRequestGrid from '../../friend_pending/components/Grid/Grid';
import RequestSentGrid from '../../request_sent/components/Grid/Grid';
import Container from '../../home/components/Layout/Container';
import Header from '../../home/components/Header/Header';
import Banner from '../../banner/components/Banner';
import TabBar from '../../home/components/TabBar/TabBar';
import Sidebar from '../../sidebar/components/SideBarPage';

const FriendsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [actionSideBar, setActiveSideBar] = useState(0);
    let content;
    switch (activeTab) {
        case 0:
            content = <FriendsGrid />;
            break;
        case 1:
            content = <UserGrid />;
            break;
        case 2:
            content = <FriendsRequestGrid />;
            break;
        case 3:
            content = <div>Following List</div>;
            break;
        case 4:
            content = <RequestSentGrid />;
            break;
        default:
            content = <FriendsGrid />;
    }

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Header />
            <main>
                <Container sidebar={<Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />}>
                    <Banner />
                    <TabBar activeTab={activeTab} onSelect={setActiveTab} />
                    {content}
                </Container>
            </main>
        </div>
    );
};

export default FriendsPage; 