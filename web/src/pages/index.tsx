import React, { useState } from 'react';
import Container from '../home/components/Layout/Container';
import Header from '../home/components/Header/Header';
import Banner from '../banner/components/Banner';
import TabBar from '../home/components/TabBar/TabBar';
import styles from './index.module.css';
import Sidebar from '../sidebar/components/SideBarPage';
import HomePage from '../home/pages/HomePage';
import Friends from '../pages/friends/index';
import '../styles/reset.css';

const IndexPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  let content;
  switch (activeTab) {
    case 0:
      content = <HomePage />;
      break;
    case 1:
      content = <Friends />;
      break;
    // Thêm các case khác nếu cần
    default:
      content = <HomePage />;
  }

  return (
    <Container sidebar={<Sidebar activeTab={activeTab} onSelect={setActiveTab} />}>
    
      {content}
    </Container>
  );
};

export default IndexPage; 