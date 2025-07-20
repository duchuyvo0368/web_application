import React from 'react';
import styles from '../../home/pages/HomePage.module.css';
import FriendsRequestGrid from '../components/Grid/Grid';



const FriendsRequest: React.FC = () => {
    return (
        <div className={styles.wrapper}>
           
            <main className={styles.main}>
                    <FriendsRequestGrid />
            </main>
        </div>
    );
};

export default FriendsRequest; 