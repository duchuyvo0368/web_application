// import React, { ReactNode } from 'react';
// import styles from './Container.module.css';

// interface FriendsContainerProps {
//   sidebar: ReactNode;
//   children: ReactNode;
//   className?: string;
// }

// const FriendsContainer: React.FC<FriendsContainerProps> = ({ sidebar, children, className = '' }) => {
//   return (
//     <div className={`${styles.wrapper} ${className}`}>
//       <aside className={styles.sidebar}>{sidebar}</aside>
//       <main className={styles.main}>{children}</main>
//     </div>
//   );
// };

// export default FriendsContainer;

import React from 'react';

interface ContainerProps {
  sidebar: React.ReactNode; // Can accept any React node for the sidebar
  children: React.ReactNode; // The main content area
}

const Container: React.FC<ContainerProps> = ({ sidebar, children }) => {
  return (
    <div className="flex gap-6 max-w-7xl mx-auto p-4">
      <aside className="w-1/4 sticky top-[88px] h-[calc(100vh-104px)]">
        {sidebar}
      </aside>
      <div className="w-3/4 flex gap-6">
        {children}
      </div>
    </div>
  );
};

export default Container;