import React from 'react';
import styles from './HomePage.module.css';
import Toolbar from '../components/Header/Header';
import Container from '../components/Layout/Container';
import Sidebar from '../components/Sidebar/Sidebar';
import Banner from '../../banner/components/Banner';
import UserHeader from '../../users/components/Header/Header';
import UserGrid from '../../users/components/Grid/Grid';
import FriendGrid from '../../friends/components/Grid/Grid';
import Header from '../../users/components/Header/Header';



const HomePage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Toolbar />
      <main className={styles.main}>
        <Container sidebar={<Sidebar />}>
          <Banner />
                  <Header title='People you may know' />
          <UserGrid/>
        </Container>
      </main>
    </div>
  );
};

export default HomePage; 