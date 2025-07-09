import { Module } from '@nestjs/common';
import { FriendModule } from './module/firends/friend.module';
import { UserModule } from './module/user/user_module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './module/database/config';
@Module({
    imports: [MongooseModule.forRoot(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
        connectionName: 'MONGODB_CONNECTION',
        ...config.options,
    }),
    FriendModule, UserModule],
})
export class AppModule { } 