// auth.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { setupTokenExpirySocket } from '../utils/auth.utils';


@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000', // hoặc URL FE của bạn
    },
})
export class AppGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`✅ Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('authenticate')
    handleAuth(client: Socket, payload: any) {
        console.log('📩 Authenticate event:', payload);
        // kiểm tra token ở đây
    }

    // Ví dụ gửi sự kiện khi token sắp hết hạn
    sendTokenExpiring(clientId: string) {
        this.server.to(clientId).emit('token_expiring');
    }
}

