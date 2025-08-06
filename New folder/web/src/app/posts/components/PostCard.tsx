/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { JSX, useMemo, useRef, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { PostCardProps } from "../type";
import { updatePostFeel } from "../post.service";
import clsx from "clsx";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { extractHashtagsAndContent, formatDate } from "@/utils";
const isVideo = (url: string) =>
  url?.endsWith(".mp4") || url?.endsWith(".webm") || url?.endsWith(".ogg");
const FEELS = [
  { type: "like", icon: "❤️" },
  { type: "love", icon: "😍" },
  { type: "haha", icon: "😂" },
];
const PostCard: React.FC<PostCardProps> = ({
  userName,
  avatar,
  postId,
  title,
  content,
  images = [],
  videos = [],
  feel,
  hashtags,
  feelCount,
  comments,
  views,
  post_link_meta,
  createdAt,
}) => {
  const [showFeelOptions, setShowFeelOptions] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const initialFeel: "like" | "love" | "haha" | "" = feel?.[userInfo._id] || "";
  const [userFeel, setUserFeel] = useState<"like" | "love" | "haha" | "">(
    initialFeel
  );

  const [feelCounts, setFeelCounts] = useState<Record<string, number>>(
    feelCount || {}
  );
  const totalFeelCount = useMemo(() => {
    return Object.values(feelCounts || {}).reduce((acc, cur) => acc + cur, 0);
  }, [feelCounts]);

  console.log("feel:", initialFeel, "userInfo:", userInfo._id);

  console.log("postId:", postId);
  const handleFeelClick = async (type: "like" | "love" | "haha") => {
    const newFeel = userFeel === type ? "" : type;
    const oldFeel = userFeel; // Lưu cảm xúc cũ tại thời điểm này

    try {
      await updatePostFeel({ postId, feel: newFeel });

      setFeelCounts((prev) => {
        const newCounts = { ...prev };

        if (oldFeel && newCounts[oldFeel]) {
          newCounts[oldFeel] = Math.max(newCounts[oldFeel] - 1, 0);
        }

        if (newFeel) {
          newCounts[newFeel] = (newCounts[newFeel] || 0) + 1;
        }

        return newCounts;
      });

      setUserFeel(newFeel);
    } catch (error) {
      console.error("Failed to update feel:", error);
    }
  };

  console.log("content hashtags:", hashtags);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-xl p-4 shadow-sm mb-6">
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <img
            src={avatar || "/images/user-image.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-blue-200 shadow object-cover"
          />
          <div>
            <div className="flex items-center gap-1 font-semibold text-sm">
              {userName || "Unknown"}
              <VerifiedIcon
                className="w-2 h-2 text-blue-500"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
            <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
          </div>
        </div>

        {/* Title */}
        {title && (
          <div className="font-bold text-base my-2 text-center">{title}</div>
        )}

        {/* Content */}
        <div className="text-sm text-gray-700 whitespace-pre-line mt-2">
          {content && <div>{content}</div>}

          {Array.isArray(hashtags) && hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => console.log("Clicked hashtag:", tag)}
                  className="text-blue-500 font-medium cursor-pointer hover:underline"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Link preview */}
        {post_link_meta ? (
          <a
            href={post_link_meta.post_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex border border-gray-200 mt-3 rounded-lg overflow-hidden hover:shadow-sm transition"
          >
            {post_link_meta.post_link_image &&
              /^https?:\/\//.test(post_link_meta.post_link_image.trim()) && (
                <div className="w-1/3 max-h-32 overflow-hidden">
                  <img
                    src={post_link_meta.post_link_image}
                    alt={post_link_meta.post_link_title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            <div className="p-3 flex flex-col justify-between w-2/3">
              <div className="text-sm font-semibold text-gray-800 line-clamp-2">
                {post_link_meta.post_link_title}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">
                {post_link_meta.post_link_description}
              </div>
              <div className="text-xs text-blue-500 truncate">
                {post_link_meta.post_link_url}
              </div>
            </div>
          </a>
        ) : null}

        {/* Media: Images + Videos */}
        {/* Media: Images + Videos with preview */}
        {/* Media: Images + Videos with preview */}
        {(images.length > 0 || videos.length > 0) &&
          (() => {
            const allMedia = [...images, ...videos];
            const imageOnly = images;
            const isVideo = (url: string) =>
              url.endsWith(".mp4") ||
              url.endsWith(".mov") ||
              url.endsWith(".webm");

            const maxShow = 3;
            const extraCount = allMedia.length - maxShow;
            const isSingleMedia = allMedia.length === 1;
            const isOneImageOneVideo =
              allMedia.length === 2 &&
              images.length === 1 &&
              videos.length === 1;

            return (
              <div className="mt-3">
                <PhotoProvider>
                  <div
                    className={clsx(
                      isSingleMedia
                        ? "w-full"
                        : isOneImageOneVideo
                        ? "grid grid-cols-1 gap-2"
                        : "grid grid-cols-2 gap-2"
                    )}
                  >
                    {allMedia.slice(0, maxShow).map((url, idx) => {
                      const isVid = isVideo(url);
                      const isFirst = idx === 0;
                      const isLast = idx === maxShow - 1 && extraCount > 0;

                      return (
                        <div
                          key={idx}
                          className={clsx(
                            "relative overflow-hidden rounded-lg",
                            (isSingleMedia || isFirst) && "col-span-2",
                            isOneImageOneVideo ? "h-[260px]" : "h-[300px]"
                          )}
                        >
                          {isVid ? (
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <PhotoView src={url}>
                              <img
                                src={url}
                                alt={`img-${idx}`}
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                              />
                            </PhotoView>
                          )}

                          {isLast && !isVid && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg pointer-events-none">
                              <span className="text-white text-2xl font-semibold">
                                +{extraCount}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {imageOnly.slice(maxShow).map((url, idx) => (
                      <PhotoView key={`hidden-${idx}`} src={url}>
                        <div className="hidden" />
                      </PhotoView>
                    ))}
                  </div>
                </PhotoProvider>
              </div>
            );
          })()}

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <div
            className="relative inline-block select-none"
            onMouseEnter={() => setShowFeelOptions(true)}
            onMouseLeave={() => setShowFeelOptions(false)}
          >
            <button
              onClick={() =>
                handleFeelClick(userFeel === "like" ? "haha" : "love")
              }
              className="flex items-center gap-1 text-sm text-gray-700 hover:opacity-80 select-none"
              type="button"
            >
              {/* Icon tùy theo userFeel */}
              {userFeel === "like" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current text-red-500 transition-colors duration-200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
          2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h1.75
          C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 
          3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              )}
              {userFeel === "love" && (
                <span
                  className="text-red-600 text-lg select-none"
                  aria-label="love"
                >
                  😍
                </span>
              )}
              {userFeel === "haha" && (
                <span
                  className="text-yellow-500 text-lg select-none"
                  aria-label="haha"
                >
                  😂
                </span>
              )}
              {!userFeel && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-current text-gray-400 transition-colors duration-200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
          2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h1.75
          C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 
          3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              )}

              {/* Text hiển thị tương ứng */}
              <span className="select-none">
                {userFeel === "like" &&
                  `${totalFeelCount} All${totalFeelCount !== 1 ? "s" : ""}`}
                {userFeel === "love" &&
                  `${totalFeelCount} All${totalFeelCount !== 1 ? "s" : ""}`}
                {userFeel === "haha" &&
                  `${totalFeelCount} All${totalFeelCount !== 1 ? "s" : ""}`}
                {!userFeel && `${totalFeelCount} All`}
              </span>
            </button>

            {/* Menu chọn cảm xúc */}
            {showFeelOptions && (
              <div className="absolute  left-0 flex gap-3 bg-white rounded-xl shadow-lg p-2 z-20 min-w-[130px]">
                {FEELS.map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() =>
                      handleFeelClick(type as "like" | "love" | "haha")
                    }
                    className={clsx(
                      "text-xl rounded-full p-2 transition-transform duration-150",
                      userFeel === type
                        ? "scale-125 bg-red-100 text-red-600 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-110"
                    )}
                    aria-label={type}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="flex items-center gap-1">
            <ChatBubbleOutlineIcon
              className="text-blue-400 w-4 h-4"
              fontSize="small"
            />
            {comments ?? 0} comments
          </span>

          <span className="flex items-center gap-1">
            <VisibilityIcon
              className="text-gray-400 w-4 h-4"
              fontSize="small"
            />
            {views ?? 0} views
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
