import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Group, GroupMessage } from 'src/group/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FriendMessage } from 'src/friend/entities/friend.entity';
@WebSocketGateway({
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
  ) {
    this.defaultGroup = '2d490b43-f66f-4e70-89d8-31680c12ce8e';
  }

  @WebSocketServer() server: Server;

  defaultGroup: string;

  private clientsArr: any[] = [];

  handleConnection(client: Socket) {
    const userRoom = client.handshake.query.userId; //连接需要传入userId参数

    client.join(this.defaultGroup);
    if (userRoom) {
      client.join(userRoom);
    }
    console.log('连接成功');
    return '连接成功';
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage('friendMessage')
  async sendFriendMessage(@MessageBody() data: FriendMessageDto): Promise<any> {
    const isUser = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (isUser) {
      const userFriendMap = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friend', 'user1', 'user1.id= :friendId', {
          friendId: data.friendId,
        })
        .where('user.id= :userId', { userId: data.userId })
        .getOne();

      if (!userFriendMap || !data.friendId) {
        this.server.to(data.userId).emit('groupMessage', {
          code: 'error',
          msg: '朋友消息发送错误',
          data: '',
        });
        return;
      }
      data.time = new Date().valueOf();
      const FriendMessage = this.friendMessageRepository.create(data);
      FriendMessage.friend = await this.userRepository.findOneBy({
        id: data.friendId,
      });
      FriendMessage.user = await this.userRepository.findOneBy({
        id: data.userId,
      });
      await this.friendMessageRepository.save(FriendMessage);
      //重新排序两个id拼合可以得到唯一id
      const friendRoom = [data.userId, data.friendId]
        .sort((a: string, b: string) => {
          return a.localeCompare(b);
        })
        .join();
      this.server.to(friendRoom).emit('friendMessage', {
        code: 'success',
        msg: '',
        data: FriendMessage,
      });
    }
  }
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(@MessageBody() data: GroupMessageDto): Promise<any> {
    const isUser = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (isUser) {
      const userGroupMap = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.users', 'user')
        .where('group.id = :groupId', { groupId: data.groupId })
        .andWhere('user.id = :userId', { userId: data.userId })
        .printSql()
        .getOne();
      if (!userGroupMap || !data.groupId) {
        this.server.to(data.userId).emit('groupMessage', {
          code: 'error',
          msg: '群消息发送错误',
          data: '',
        });
        return;
      }
      data.time = new Date().valueOf();
      const GroupMessage = this.groupMessageRepository.create(data);
      GroupMessage.group = await this.groupRepository.findOneBy({
        id: data.groupId,
      });
      GroupMessage.user = await this.userRepository.findOneBy({
        id: data.userId,
      });
      await this.groupMessageRepository.save(GroupMessage);
      this.server
        .to(data.groupId)
        .emit('groupMessage', { code: 'success', msg: '', data: GroupMessage });
    }
  }

  @SubscribeMessage('getGroups')
  async getGroups(client: Socket) {
    const userId = client.handshake.query.userId;
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .leftJoinAndSelect('group.groupMessages', 'groupMessage')
      .leftJoinAndSelect('groupMessage.user', 'user1')
      .where('user.id = :userId', { userId: userId })
      .orderBy('groupMessage.createTime', 'DESC')
      .getMany();
    //console.log(group);
    group.forEach((e) => {
      client.join(e.id);
    });
    this.server.to(userId).emit('getGroups', {
      code: 'success',
      msg: '',
      data: group,
    });
  }
  @SubscribeMessage('getFriends')
  async getFriends(client: Socket) {
    const userId = client.handshake.query.userId;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friend', 'friend')
      .where('user.id= :userId', { userId: userId })
      .printSql()
      .getOne();

    const friends = await Promise.all(
      user.friend.map(async (element) => {
        const friendMessages = await this.friendMessageRepository
          .createQueryBuilder('friendMessage')
          .leftJoinAndSelect('friendMessage.user', 'user')
          .leftJoinAndSelect('friendMessage.friend', 'friend')
          .where(
            `friendMessage.userId= :userId and friendMessage.friendId= :friendId or
         friendMessage.userId= :friendId and friendMessage.friendId= :userId`,
            { userId: user.id, friendId: element.id },
          )
          .orderBy('friendMessage.createTime', 'DESC')
          .getMany();
        const friendRoom = [userId, element.id]
          .sort((a: string, b: string) => {
            return a.localeCompare(b);
          })
          .join();
        client.join(friendRoom);
        element.friendMessages = friendMessages;
        return element;
      }),
    );

    this.server.to(userId).emit('getFriends', {
      code: 'success',
      msg: '',
      data: friends,
    });
  }
}
