import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    if (createUser.passwordRepeat != createUser.password)
      throw new HttpException('前后密码不一致', HttpStatus.BAD_REQUEST);
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }
}
