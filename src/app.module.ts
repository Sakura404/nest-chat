import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { FriendModule } from './friend/friend.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      entityPrefix: 'nc_',
    }),
    UserModule,
    GroupModule,
    FriendModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
