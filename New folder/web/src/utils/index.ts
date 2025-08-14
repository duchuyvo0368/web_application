export const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
export const splitContentAndHashtagsAndFriends = (
    text: string
): { content: string; hashtags: string[]; friends: string[] } => {
    if (!text) return { content: "", hashtags: [], friends: [] };

    const words = text.split(/\s+/);

    const hashtags = words.filter(word => /^#[\p{L}0-9_-]+$/u.test(word));
    const friends = words.filter(word => /^@[\p{L}0-9_-]+$/u.test(word));

    const content = words
        .filter(
            word =>
                !/^#[\p{L}0-9_-]+$/u.test(word) &&
                !/^@[\p{L}0-9_-]+$/u.test(word)
        )
        .join(" ")
        .trim();

    return {
        content,
        hashtags: Array.from(new Set(hashtags.map(tag => tag.slice(1)))),
        friends: Array.from(new Set(friends.map(tag => tag.slice(1))))
    };
};

export const formatDate = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // giây

    if (diff < 60) return "Just now";
    if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    }
    if (diff < 86400) {
        const hrs = Math.floor(diff / 3600);
        return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
    }
    if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    if (diff < 31536000) {
        const months = Math.floor(diff / 2592000);
        return `${months} month${months === 1 ? "" : "s"} ago`;
    }
    const years = Math.floor(diff / 31536000);
    return `${years} year${years === 1 ? "" : "s"} ago`;


};

export const extractHashtagsAndContent = (text: string) => {
    const hashtagRegex = /#[\w\u00C0-\u1EF9]+/g;
    const hashtags: string[] = [];
    const content = text.replace(hashtagRegex, (match) => {
        hashtags.push(match.trim());
        return '';
    }).trim();

    return { content, hashtags };
};