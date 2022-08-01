import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { FriendModule } from './friend/friend.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envConfig.path] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        logging: ['error'],
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: 3306,
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DATABASE'),
        entities: ['dist/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
        entityPrefix: 'nc_',
      }),
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
