// import React from 'react';

// const RightSidebar: React.FC = () => (
//     <aside className="fixed top-[73px] right-0 bottom-0 w-[200px] bg-white shadow-lg z-40">
//     <div className="h-full overflow-y-hidden hover:overflow-y-auto p-3" >
//       <div className="rounded-lg overflow-hidden">
//         <img 
//           src="https://file.apetavers.com/api/files/admin/20250619/15cb24ab-7428-4cdb-b115-d4b2feb0a709--1920.webp" 
//           alt="Sidebar content" 
//           style={{width: '280px', height: '100px'}}
//         />
//       </div>

      
//     </div>
//   </aside>
// );

// export default RightSidebar;
import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      Right Sidebar Content
    </div>
  );
};

export default RightSidebar;