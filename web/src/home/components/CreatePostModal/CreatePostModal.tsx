'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ex } from '../../services/home.service';
import type { UserInfo } from '../../types';

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    userInfo: UserInfo;
    onPostCreated: (p: Post) => void;
}

export default function CreatePostModal({ open, onClose, userInfo, onPostCreated }: CreatePostModalProps) {
    const descRef = useRef<HTMLDivElement>(null);
    const [image, setImage] = useState<File | null>(null);
    const [linkMeta, setLinkMeta] = useState<any>(null);
    const [linkLoading, setLinkLoading] = useState(false);
    const [privacy, setPrivacy] = useState<'public' | 'friend' | 'private'>('public');
    const [posting, setPosting] = useState(false);

    // Close on Esc
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    // Extract link on input
    const handleDescChange = () => {
        const text = descRef.current?.innerText || '';
        const match = text.match(/(https?:\/\/[^\s]+)/);
        const url = match?.[0];
        if (url && (!linkMeta || linkMeta.url !== url)) {
            setLinkLoading(true);
            extractLinkMetadata({
                url,
                onSuccess: (meta) => {
                    setLinkMeta({ ...(meta.metadata || {}), url });
                    setLinkLoading(false);
                },
                onError: () => {
                    setLinkMeta(null);
                    setLinkLoading(false);
                },
            });
        }
    };

    // Submit
    const handleSubmit = async () => {
        const desc = descRef.current?.innerText.trim() || '';
        if (!desc && !image && !linkMeta) return;
        setPosting(true);
        try {
            // call API here
            onPostCreated({} as Post);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setPosting(false);
        }
    };

    const resetState = () => {
        setImage(null);
        setLinkMeta(null);
        setPosting(false);
        descRef.current && (descRef.current.innerText = '');
    };

    // avoid immediate close right after opening
    const canCloseRef = useRef(false);
    useEffect(() => {
        const id = setTimeout(() => (canCloseRef.current = true), 10);
        return () => clearTimeout(id);
    }, [open]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && canCloseRef.current) {
            handleClose();
        }
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 shadow-2xl flex flex-col z-[10000] relative"
                    >
                        {/* Header */}
                        <div className="relative border-b px-4 py-3 text-center">
                            <h3 className="font-semibold text-lg">Tạo bài viết</h3>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700"
                                onClick={handleClose}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {/* User Row */}
                            <div className="flex items-center gap-3">
                                <Image
                                    src={userInfo.avatar || '/default-avatar.png'}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                                <select
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value as any)}
                                    className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-neutral-800"
                                >
                                    <option value="public">Công khai</option>
                                    <option value="friend">Bạn bè</option>
                                    <option value="private">Chỉ mình tôi</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div
                                ref={descRef}
                                contentEditable
                                onInput={handleDescChange}
                                className="min-h-[80px] w-full rounded border border-gray-200 p-3 text-sm outline-none focus:border-blue-400 dark:border-neutral-700 dark:bg-neutral-800"
                                suppressContentEditableWarning
                            />

                            {/* Link preview */}
                            {linkLoading && <p className="text-xs text-gray-400">Đang lấy thông tin liên kết...</p>}
                            {linkMeta && (
                                <a
                                    href={linkMeta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block overflow-hidden rounded border hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    {linkMeta.image && (
                                        <Image src={linkMeta.image} alt="preview" width={500} height={260} className="w-full object-cover" />
                                    )}
                                    <div className="p-3">
                                        <p className="line-clamp-2 text-sm font-medium">{linkMeta.title}</p>
                                        <p className="line-clamp-2 text-xs text-gray-500">{linkMeta.description}</p>
                                    </div>
                                </a>
                            )}

                            {/* Image upload */}
                            {image ? (
                                <div className="relative">
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt="upload preview"
                                        width={500}
                                        height={300}
                                        className="rounded"
                                    />
                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => document.getElementById('fileInput')?.click()}
                                    className="rounded border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    Tải ảnh lên
                                </button>
                            )}
                            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>

                        {/* Footer */}
                        <div className="border-t px-4 py-3 text-right dark:border-neutral-700">
                            <button
                                disabled={posting}
                                onClick={handleSubmit}
                                className={clsx(
                                    'rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700',
                                    posting && 'cursor-not-allowed opacity-60'
                                )}
                            >
                                {posting ? 'Đang đăng...' : 'Đăng'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}







