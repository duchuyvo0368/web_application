import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import PostCard from '../components/PostCard/PostCard';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Banner from '../../banner/components/Banner';
import { getPostUser } from '../services/home.service';
// import RightSidebar from '../components/RightSidebar/RightSidebar'; // Nếu không cần sidebar phải thì có thể xóa dòng này

const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  // Thêm state cho posts
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPostUser({
      limit: 10,
      pages: 1,
      onSuccess: (data) => {
        // Giả sử data dạng { posts: [...] } hoặc data.data
        setPosts(data?.posts || data?.data || []);
        setLoading(false);
      },
      onError: (err) => {
        setError(typeof err === 'string' ? err : 'Error fetching posts');
        setLoading(false);
      }
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Header />
      <Banner />
      <div
        style={{
          display: 'flex',
          background: '#f5f6fa',
          minHeight: '80vh',
          padding: '16px 0'
        }}
      >
        {/* Feed ở giữa, banner và card post cùng container */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: 1100, width: '100%', marginLeft: 120 }}>

            {/* Thanh "Bạn đang nghĩ gì?" */}
            <div
              className={styles.createPostBar}
              onClick={() => setShowModal(true)}
            >
              <img
                src="/images/user-image.png"
                alt="avatar"
                className={styles.createPostAvatar}
              />
              <input
                className={styles.createPostInput}
                placeholder="Huy, please share your moments and memories!"
                readOnly
              />
            </div>
            {/* Modal tạo bài viết */}
            {showModal && (
              <div
                className={styles.createPostModalOverlay}
                onClick={() => setShowModal(false)}
              >
                <div
                  className={styles.createPostModal}
                  onClick={e => e.stopPropagation()}
                >
                  <h2 className={styles.createPostModalTitle}>Create Post</h2>
                  {/* Privacy */}
                  <div className={styles.createPostField}>
                    <span className={styles.createPostIcon}>🔒</span>
                    <select
                      className={styles.createPostSelect}
                      value={privacy}
                      onChange={e => setPrivacy(e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="friend">Friends</option>
                      <option value="private">Only me</option>
                    </select>
                  </div>
                  {/* Title */}
                  <div className={styles.createPostField}>
                    <span className={styles.createPostIcon}>📝</span>
                    <input
                      className={styles.createPostInputField}
                      placeholder="Post title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                  {/* Content */}
                  <div className={styles.createPostField}>
                    <span className={styles.createPostIcon}>🗒️</span>
                    <textarea
                      className={styles.createPostTextarea}
                      placeholder="Post content..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  {/* Preview hashtag màu xanh */}
                 
                  {/* Image choice */}
                  <div className={styles.createPostField}>
                    <span className={styles.createPostIcon}>🖼️</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ marginLeft: 4 }}
                    />
                  </div>
                  {image && (
                    <div style={{ marginBottom: 16 }}>
                      <img src={image} alt="preview" style={{ maxWidth: 200, borderRadius: 8 }} />
                    </div>
                  )}
                  <button
                    className={styles.createPostModalButton}
                    onClick={() => setShowModal(false)}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            )}
            {/* Danh sách bài viết */}
            {loading && <div>Loading...</div>}
            {error && <div style={{color:'red'}}>{error}</div>}
            {posts.map((post, idx) => (
              <PostCard
                key={post.id || idx}
                avatar={post.avatar || "/images/user-image.png"}
                username={post.username || post.author || "Unknown"}
                time={post.time || post.createdAt || ""}
                title={post.title || "No title"}
                content={post.content || ""}
                image={post.images || post.imageUrl || ""}
                stats={{
                  like: post.likesCount || post.like || 0,
                  star: post.star || 0,
                  comment: post.commentsCount || post.comment || 0,
                  view: post.view || 0
                }}
                post_link_meta={post.post_link_meta}
              />
            ))}
          </div>
        </div>
        {/* Nếu muốn giữ sidebar phải thì giữ lại, không thì xóa luôn */}
        <div style={{ width: 260, marginLeft: 10 }}>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;