import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private jwtService: JwtService,
  ) {}

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const payload = {
      id: user.id,
      username: user.nickname,
    };
    const token = this.jwtService.sign(payload);
    return { token: token, user: user };
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
    let newUser = await this.userRepository.create(createUser);
    newUser = await this.userRepository.save(newUser);
    const defaultGroup = await this.groupRepository.findOne({
      relations: ['users'],
      where: { id: '默认群组' },
    });
    defaultGroup.users.push(newUser);
    this.groupRepository.save(defaultGroup);
    return newUser;
  }
}
