import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStorage } from './local.strategy';
import { JwtStorage } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Group } from 'src/group/entities/group.entity';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', '123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});
@Module({
  imports: [jwtModule, TypeOrmModule.forFeature([User, Group]), PassportModule],
  exports: [jwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStorage,
    JwtStorage,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AuthModule {}
