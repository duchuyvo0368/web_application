'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { refreshToken } from './auth.service';

let socket: Socket;

export const useAuthSocket = () => {
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshTk = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshTk) {
            console.warn('Missing tokens → Cannot start socket.');
            return;
        }

        socket = io('http://localhost:5000', { transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('authenticate', { token: accessToken });
        });

        // Server báo sắp hết hạn → refresh
        socket.on('token_expiring', () => {
            console.log('Token sắp hết hạn → Refresh...');
            refreshToken({
                token: refreshTk,
                onSuccess: (res) => {
                    const newAccess = res?.metadata?.tokens?.accessToken;
                    const newRefresh = res?.metadata?.tokens?.refreshToken;

                    if (newAccess) {
                        localStorage.setItem('accessToken', newAccess);
                        if (newRefresh) {
                            localStorage.setItem('refreshToken', newRefresh);
                        }
                        console.log('Token refreshed!');
                        socket.emit('authenticate', { token: newAccess });
                    } else {
                        handleLogout();
                    }
                },
                onError: (err) => {
                    console.error('Refresh token error:', err);
                    handleLogout();
                },
            });
        });

        // Server báo hết hạn → logout
        socket.on('token_expired', () => {
            console.warn(' Token expired!');
            handleLogout();
        });

        return () => {
            if (socket) {
                socket.disconnect();
                console.log('🧹 Socket cleaned up');
            }
        };
    }, []);
};

function handleLogout() {
    localStorage.clear();
    window.location.href = '/login';
}
