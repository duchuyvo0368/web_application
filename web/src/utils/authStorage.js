"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserToLocalStorage = saveUserToLocalStorage;
exports.getUserFromLocalStorage = getUserFromLocalStorage;
exports.removeUserFromLocalStorage = removeUserFromLocalStorage;
function saveUserToLocalStorage(user) {
    const localUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
    };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(localUser));
}
function getUserFromLocalStorage() {
    if (typeof window === 'undefined')
        return null; // tránh lỗi SSR
    const userStr = localStorage.getItem('user');
    try {
        return userStr ? JSON.parse(userStr) : null;
    }
    catch {
        return null;
    }
}
function removeUserFromLocalStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
}
//# sourceMappingURL=authStorage.js.map