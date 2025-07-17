import React, { useState } from 'react';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import Container from '../components/Layout/Container';
import Sidebar from '../../sidebar/components/SideBarPage';
import Banner from '../../banner/components/Banner';
import FriendsGrid from '../../friends/components/Grid/Grid';
import FriendsRequestGrid from '../../friend_request/components/Grid/Grid';
import RequestSentGrid from '../../request_sent/components/Grid/Grid';
import UserGrid from '../../users/components/Grid/Grid';
import Profile from '../../users/components/Profile/Profile';
import TabBar from '../components/TabBar/TabBar'
const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlider, setActiveSlider] = useState(0);
  let content;
  switch (activeTab) {
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
      break


    default:
      content = <FriendsGrid />;

  }

  // let title;
  // switch (activeTab) {
  //   case 1:
  //     title = 'All';
  //     break;
  //   case 2:
  //     title = 'Received Requests';
  //     break;
  //   case 3:
  //     title = 'Sent Requests';
  //     break;
  //   case 4:
  //     title = 'Following List';
  //     break;

  //   default:
  //     title = '';
  // }

  return (
    <div className={styles.wrapper} style={{ overflowX: 'hidden' }}>
      <Header />
      <main className={styles.main}>
        <Container sidebar={<Sidebar activeTab={activeSlider} onSelect={setActiveSlider} />}>
          <Banner />
          <TabBar activeTab={activeTab} onSelect={setActiveTab} />
          {content}
        </Container>
      </main>
    </div>
  );
};

export default HomePage; 