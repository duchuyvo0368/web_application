import React from 'react';
import styles from '../../home/pages/HomePage.module.css';
import Toolbar from '../../home/components/Header/Header';
import Container from '../../home/components/Layout/Container';
import Sidebar from '../../home/components/Sidebar/Sidebar';
import FriendsRequestGrid from '../components/Grid/Grid';
import Banner from '../../banner/components/Banner';
import Header from '../../users/components/Header/Header';


const RequestSent: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <Toolbar />
            <main className={styles.main}>
                <Container sidebar={<Sidebar />}>
                    <Banner />
                    <Header title='Request Sent'/>
                    <FriendsRequestGrid />
                </Container>
            </main>
        </div>
    );
};

export default RequestSent; 