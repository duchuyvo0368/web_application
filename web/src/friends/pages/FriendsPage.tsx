import React from 'react';
import styles from '../../friends/pages/HomePage.module.css';
import Toolbar from '../../home/components/Header/Header';
import Container from '../../home/components/Layout/Container';
import Sidebar from '../../home/components/Sidebar/Sidebar';
import Banner from '../../banner/components/Banner';
import UserHeader from '../../users/components/Header/Header';
import FriendGrid from '../../friends/components/Grid/Grid';
import Header from '../../users/components/Header/Header';

const FriendsPage: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <Toolbar />
            <main className={styles.main}>
                <Container sidebar={<Sidebar />}>
                    <Banner />
                    <Header />
                    <FriendGrid />
                </Container>
            </main>
        </div>
    );
};

export default FriendsPage; 