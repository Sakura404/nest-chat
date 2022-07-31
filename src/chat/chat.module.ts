import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Group, GroupMessage } from 'src/group/entities/group.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FriendMessage } from 'src/friend/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, GroupMessage, FriendMessage]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}
  async onModuleInit() {
    const defaultGroup = await this.groupRepository.find({
      where: {
        groupName: '默认群组',
      },
    });
    if (!defaultGroup.length) {
      await this.groupRepository.save({
        id: '默认群组',
        groupName: '默认群组',
        userId: 'admin',
      });
      console.log('create default group 阿童木聊天室');
    }
  }
}
