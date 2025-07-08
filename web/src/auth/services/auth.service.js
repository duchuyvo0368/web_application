"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.logout = exports.login = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const authStorage_1 = require("../../utils/authStorage");
const API_CONFIG = "http://localhost:5000/v1/api";
const login = async ({ data, onSuccess, onError, }) => {
    try {
        const res = await axios_1.default.post(`${API_CONFIG}/auth/login`, data);
        (0, authStorage_1.saveUserToLocalStorage)(res.data.metadata?.user);
        onSuccess?.(res.data);
    }
    catch (err) {
        onError?.(err.response?.data || err);
    }
};
exports.login = login;
const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
};
exports.logout = logout;
const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.service.js.map