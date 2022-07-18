import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async addFriend(userId: string, friendId: string) {
    const user = await this.userRepository.findOne({
      relations: ['friend'],
      where: { id: userId },
    });
    const friend = await this.userRepository.findOne({
      relations: ['friend'],
      where: { id: friendId },
    });
    console.log(user, friend);
    user.friend.push(friend);
    friend.friend.push(user);

    await this.userRepository.save(user);
    await this.userRepository.save(friend);
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
function where(where: any, arg1: { Id: any }) {
  throw new Error('Function not implemented.');
}
