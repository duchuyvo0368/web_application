import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import PostCard from '../components/PostCard/PostCard';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Banner from '../../banner/components/Banner';
import { getPostUser, extractLinkMetadata, createPost } from '../services/home.service'; // Đảm bảo import đúng đường dẫn
// import RightSidebar from '../components/RightSidebar/RightSidebar'; // Nếu không cần sidebar phải thì có thể xóa dòng này

const HomePage: React.FC = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [showModal, setShowModal] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  // Thêm state cho posts
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postLinkMeta, setPostLinkMeta] = useState<any>(null);
  const [modalLinkMeta, setModalLinkMeta] = useState<any>(null);
  const [modalLinkLoading, setModalLinkLoading] = useState(false);

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

  // Thêm useEffect để cập nhật title khi metadata thay đổi
  useEffect(() => {
    if (modalLinkMeta?.title && !title) {
      setTitle(modalLinkMeta.title);
    }
  }, [modalLinkMeta]);

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

  // Hàm kiểm tra có url trong content
  const extractUrl = (text: string) => {
    // Regex này sẽ lấy URL đến hết ký tự hợp lệ, không lấy dấu cách, dấu câu, hoặc ký tự đặc biệt phía sau
    const urlRegex = /(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)(?=\s|$|['"<>])/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  // Đã có sẵn logic tự động detect link và gọi extractLinkMetadata khi nhập content.
  // Đảm bảo không debounce, gọi ngay khi phát hiện link.
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    const url = extractUrl(value);
    if (url) {
      setModalLinkLoading(true);
      extractLinkMetadata({
        url,
        onSuccess: (meta) => {
          setModalLinkMeta(meta.metadata || meta);
          setModalLinkLoading(false);
        },
        onError: () => {
          setModalLinkMeta(null);
          setModalLinkLoading(false);
        }
      });
    } else {
      setModalLinkMeta(null);
      setModalLinkLoading(false);
    }
  };

  const handleCreatePost = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?.id || userInfo?._id || '';
    const postTitle = modalLinkMeta?.title ? `${title} - ${modalLinkMeta.title}` : title;
    const postData = {
      userId,
      title: postTitle,
      content,
      images: image || undefined,
      post_link_meta: modalLinkMeta ? JSON.stringify(modalLinkMeta.metadata || modalLinkMeta) : undefined,
      privacy,
    };
    try {
      await createPost({
        data: postData,
        onSuccess: () => {
          setShowModal(false);
        },
        onError: () => {
          alert('Create post failed!');
        }
      });
    } catch (err) {
      alert('Create post failed!');
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
                src={userInfo.avatar || "/images/user-image.png"}
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
                    <select
                      className={styles.createPostSelect}
                      value={privacy}
                      onChange={e => setPrivacy(e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="friend">Friends</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  {/* Title */}
                  <div className={styles.createPostField}>
                    <input
                      className={styles.createPostInputField}
                      placeholder="Post title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                  {/* Content */}
                  <div className={styles.createPostField} style={{ flexDirection: 'column', alignItems: 'stretch', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <textarea
                      className={styles.createPostTextarea}
                      placeholder="Post content..."
                      value={content}
                      onChange={handleContentChange}
                      rows={4}
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                    />
                    
                    {modalLinkMeta && (
                      <div
                        style={{
                          margin: '12px 0 0 0',
                          border: '1.5px solid #1976d2',
                          borderRadius: 10,
                          padding: 10,
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          background: '#f4f8fd',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(modalLinkMeta.url, '_blank')}
                      >
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{modalLinkMeta.title}</div>
                        <div style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal',
                          fontSize: 13,
                          marginBottom: 6
                        }}>{modalLinkMeta.description}</div>
                        {modalLinkMeta.image && (
                          <img src={modalLinkMeta.image} alt="preview" style={{ width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: 80, borderRadius: 6, margin: '6px 0' }} />
                        )}
                        {/* Không hiển thị url */}
                      </div>
                    )}
                  </div>
                  {/* Preview hashtag màu xanh */}
                 
                  {/* Image choice */}
                  {!modalLinkMeta && (
                    <>
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
                    </>
                  )}
                  <button
                    className={styles.createPostModalButton}
                    onClick={handleCreatePost}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            )}
            {/* Danh sách bài viết */}
            {loading && <div>Loading...</div>}
            {error && <div style={{color:'red'}}>{error}</div>}
            {posts.map((post, idx) => {
              const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
              return (
                <PostCard
                  key={post.id || idx}
                  avatar={userInfo.avatar || "/images/user-image.png"}
                  user={[
                    post.userId || post.userId._id || '',
                    post.username || post.userId.name || 'Unknown'
                  ]}
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
                  post_link_meta={post.post_link_meta || (idx === 0 ? postLinkMeta : undefined)}
                />
              );
            })}
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