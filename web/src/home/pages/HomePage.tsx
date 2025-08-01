// import React, { useState, useEffect } from 'react';
// import Header from '../components/Header/Header';
// import PostCard from '../components/PostCard/PostCard';
// import RightSidebar from '../components/RightSidebar/RightSidebar';
// import Banner from '../../banner/components/Banner';
// import { getPostUser } from '../services/home.service';
// import Container from '../components/Layout/Container';
// import Sidebar from '../../sidebar/components/SideBarPage';
// import CreatePostModal from '../components/CreatePostModal/CreatePostModal';
// import type { UserInfo, Post } from '../types';
// import styles from './HomePage.module.css';

// interface HomePageProps { }

// const HomePage: React.FC<HomePageProps> = () => {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [actionSideBar, setActiveSideBar] = useState(0);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
//       setUserInfo(info);
//     }
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     getPostUser({
//       limit: 10,
//       pages: 1,
//       onSuccess: (data) => {
//         setPosts(data?.data || []);
//         setLoading(false);
//       },
//       onError: (err) => {
//         setError(typeof err === 'string' ? err : 'Error fetching posts');
//         setLoading(false);
//       }
//     });
//   }, []);

//   const handlePostCreated = (newPost: Post) => {
//     setPosts(prev => [newPost, ...prev]);
//   };

//   if (!userInfo) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <main className="min-h-screen bg-gray-100">
//       <Header />
//       <Container sidebar={<Sidebar activeTab={actionSideBar} onSelect={setActiveSideBar} />}>
//         <Banner />
//         <div className={styles.content}>
//           {/* Main Content Area */}
//           <main className={styles.mainContent}>
//             {/* Post Creation Bar */}
//             {/* Post Creation Bar */}
//             <div className={styles.postCreationBar + ' p-10 flex items-center'}> {/* Removed min-h-screen and added flex utilities */}
//               <img
//                 src={userInfo.avatar || "/images/user-image.png"}
//                 alt="User avatar"
//                 className="w-8 h-8 rounded-full mr-3"
//                 style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0 }} // Added flexShrink to prevent image from shrinking
//                 onClick={e => e.stopPropagation()}
//               />
//               <div
//                 className={styles.postInput + ' w-full'} // Added w-full to take up remaining space
//                 onClick={() => setShowModal(true)}
//               >
//                 <span className="text-gray-500">Share your moments and memories!</span>
//               </div>
//             </div>

//             {/* Create Post Modal - Positioned absolutely to break out of parent containers */}
            
//             {showModal && userInfo && (
//               <div className="fixed inset-0 z-[9999] pointer-events-none">
//                 <CreatePostModal
//                   open={showModal}
//                   userInfo={userInfo}
//                   onClose={() => setShowModal(false)}
//                   onPostCreated={handlePostCreated}
//                 />
//               </div>
//             )}

//             {/* Posts List */}

//             <div className="w-full px-4"> {/* Added horizontal padding */}
//               {error ? (
//                 <div className="bg-white p-4 rounded-lg shadow">
//                   <p className="text-red-500 text-center">{error}</p>
//                 </div>
//               ) : loading ? (
//                 <div className="bg-white p-6 rounded-lg shadow text-center">
//                   <p className="text-gray-500">Loading posts...</p>
//                 </div>
//               ) : posts.length === 0 ? (
//                 <div className="bg-white p-6 rounded-lg shadow text-center">
//                   <p className="text-gray-500">No posts yet.</p>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4" >
//                   {posts.map((post, idx) => (
//                     <PostCard
//                       key={post._id || idx}
//                       avatar={post.userId?.avatar || "/images/user-image.png"}
//                       user={[post.userId?._id || '', post.userId?.name || 'Unknown']}
//                       time={post.createdAt || ""}
//                       title={post.title || "No title"}
//                       content={post.content || ""}
//                       images={Array.isArray(post.images) ? post.images : []}
//                       stats={{
//                         like: post.likesCount || 0,
//                         comment: post.commentsCount || 0,
//                         view: post.view || 0
//                       }}
//                       post_link_meta={post.post_link_meta as any}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//           </main>

//           {/* Right Sidebar */}
//           <aside className="w-[280px]">
//             <div className="sticky top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto">
//               <RightSidebar />
//             </div>
//           </aside>
//         </div>
//       </Container>
//     </main>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from 'react';

// Import components
import Header from '../components/Header/Header';
import Sidebar from '../../sidebar/components/SideBarPage';
import Banner from '../../banner/components/Banner';
import PostCard from '../components/PostCard/PostCard';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Container from '../components/Layout/Container';
import CreatePostModal from '../components/CreatePostModal/CreatePostModal';

// Import types and services
import { UserInfo, Post } from '../types';
import { getPosts, getUserInfoMock } from '../services/home.service'; // Renamed getPostUser to getPosts

const HomePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState(0); // Renamed for clarity

  // Fetch user info on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = getUserInfoMock(); // Use the mock service
     setUserInfo(info);
    }
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    setLoading(true);
    getPosts({ 
      
      onSuccess: (data) => {
        setPosts(data?.data || []);
        setLoading(false);
      },
      onError: (err) => {
        setError(err); // Error is already a string
        setLoading(false);
      }
    });
  }, []);

  // Handler for a new post created from the modal
  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]); // Add new post to the top
    setShowModal(false); // Close modal
  };

  // Display loading state while user info is being fetched
  if (!userInfo) {
    return <div className="flex items-center justify-center min-h-screen">Loading user data...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <Container sidebar={<Sidebar activeTab={activeSidebarTab} onSelect={setActiveSidebarTab} />}>
        {/* Main Content Area */}
        <main className="flex-1">
          <Banner />
          
          {/* Post Creation Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center mb-6">
            <img
              src={userInfo.avatar || "/images/user-image.png"}
              alt="User avatar"
              className="w-10 h-10 rounded-full mr-4 flex-shrink-0"
            />
            <div
              className="w-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full p-3 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <span className="text-gray-500">Share your moments and memories!</span>
            </div>
          </div>

          {/* Create Post Modal */}
          {showModal && userInfo && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
              onClick={() => setShowModal(false)}
            >
              <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
                onClick={e => e.stopPropagation()}
              >
                <CreatePostModal
                  open={showModal}
                  userInfo={userInfo}
                  onClose={() => setShowModal(false)}
                  onPostCreated={handlePostCreated}
                />
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="flex flex-col gap-4">
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md text-center">{error}</div>}
            {loading && <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">Loading posts...</div>}
            {!loading && posts.length === 0 && <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">No posts yet.</div>}
            {posts.map((post) => ( // Removed idx as key, relying on post._id
              <PostCard
                key={post._id} // Using unique _id as key is more robust
                avatar={post.userId?.avatar || "/images/user-image.png"}
                user={[post.userId?._id || '', post.userId?.name || 'Unknown']}
                time={post.createdAt || ""}
                title={post.title || "No title"}
                content={post.content || ""}
                images={Array.isArray(post.images) ? post.images : []}
              />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-[280px] flex-shrink-0">
          <div className="sticky top-[88px] max-h-[calc(100vh-104px)] overflow-y-auto">
            <RightSidebar />
          </div>
        </aside>
      </Container>
    </main>
  );
};

export default HomePage;
