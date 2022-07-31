import { Injectable, NotFoundException } from '@nestjs/common';
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
  async addFriend(userId: string, friendId: string) {}
  //     const user = await this.userRepository.findOne({
  //       relations: ['friends'],
  //       where: { id: userId },
  //     });
  //     const friend = await this.userRepository.findOne({
  //       relations: ['friends'],
  //       where: { id: friendId },
  //     });
  //     console.log(user, friend);
  //     user.friends.push(friend);
  //     friend.friends.push(user);

  //     await this.userRepository.save(user);
  //     await this.userRepository.save(friend);
  //   }
  async getAllFriends(userId: string) {}
  //     const user = await this.userRepository.findOne({
  //       relations: ['friends'],
  //       where: { id: userId },
  //     });
  //     if (!user) {
  //       throw new NotFoundException('找不到该用户');
  //     }
  //     return { friends: user.friends };
  //   }
}
function where(where: any, arg1: { Id: any }) {
  throw new Error('Function not implemented.');
}
