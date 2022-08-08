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
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  //解决与前端socket.io版本不同的问题
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
    this.defaultGroup = '默认群组';
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
      console.log(123);
      const userFriendMap = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'user1', 'user1.id= :friendId', {
          friendId: data.friendId,
        })
        .where('user.id= :userId', { userId: data.userId })
        .getOne();

      if (!userFriendMap || !data.friendId) {
        this.server.to(data.userId).emit('error', {
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

      this.server.to(data.userId).to(data.friendId).emit('friendMessage', {
        code: 'success',
        msg: '',
        data: FriendMessage,
      });
    }
    console.log(123);
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
        .getOne();
      if (!userGroupMap || !data.groupId) {
        this.server.to(data.userId).emit('error', {
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
      .leftJoinAndSelect('user.friends', 'friend')
      .where('user.id= :userId', { userId: userId })
      .printSql()
      .getOne();

    const friends = await Promise.all(
      user.friends.map(async (element) => {
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

  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddFriendDto,
  ) {
    const userId = client.handshake.query.userId;
    if (userId != data.userId) {
      this.server
        .to(userId)
        .emit('error', { code: 'FAIL', msg: '非法操作', data: '' });
    }

    const isUser = await this.userRepository.findOneBy({ id: data.userId });
    if (isUser) {
      if (data.userId === data.friendId) {
        this.server.to(userId).emit('error', {
          code: 'FAIL',
          msg: '不能添加自己为好友',
          data: '',
        });
        return;
      }
      const relation = await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect(
          'user.friends',
          'friend',
          'friend.id= :friendId or friend.id= :userId',
          {
            friendId: data.friendId,
          },
        )
        .where('user.id= :userId or user.id= :friendId ', {
          userId: data.userId,
        })
        .getOne();

      const friendRoom = [data.userId, data.friendId]
        .sort((a: string, b: string) => {
          return a.localeCompare(b);
        })
        .join();
      if (relation) {
        this.server.to(data.userId).emit('error', {
          code: 'FAIL',
          msg: '已经有该好友',
          data: data,
        });
        return;
      }
      const friend = await this.userRepository.findOne({
        relations: ['friends'],
        where: {
          id: data.friendId,
        },
      });
      const user = await this.userRepository.findOne({
        relations: ['friends'],
        where: { id: data.userId },
      });
      if (!friend) {
        this.server.to(data.userId).emit('error', {
          code: 'FAIL',
          msg: '该好友不存在',
          data: '',
        });
        return;
      }
      user.friends.push(friend);
      friend.friends.push(user);
      const s = await this.userRepository.save([user, friend]);
      friend.friendMessages = await this.friendMessageRepository
        .createQueryBuilder('friendMessage')
        .leftJoinAndSelect('friendMessage.user', 'user')
        .leftJoinAndSelect('friendMessage.friend', 'friend')
        .where(
          `friendMessage.userId= :userId and friendMessage.friendId= :friendId or
         friendMessage.userId= :friendId and friendMessage.friendId= :userId`,
          { userId: user.id, friendId: friend.id },
        )
        .orderBy('friendMessage.createTime', 'DESC')
        .getMany();
      user.friendMessages = friend.friendMessages;
      //互相引用返回结果会爆栈
      friend.friends = null;
      user.friends = null;
      this.server.to(data.userId).emit('addFriend', {
        code: 'success',
        msg: `添加好友${friend.username}成功`,
        data: friend,
      });
      this.server.to(data.friendId).emit('addFriend', {
        code: 'success',
        msg: `${user.username}添加你为好友`,
        data: user,
      });
    }
    return;
  }

  @SubscribeMessage('createGroup')
  async createGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GroupDto,
  ) {
    const userId = client.handshake.query.userId;

    const isUser = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (isUser && userId == data.userId) {
      const isHaveGroup = await this.groupRepository.findOneBy({
        groupName: data.groupName,
      });
      if (isHaveGroup) {
        this.server.to(userId).emit('error', {
          code: 'error',
          msg: '该群名字已存在',
          data: isHaveGroup,
        });
        return;
      }
      let group: Group = await this.groupRepository.create(data);
      group.user = isUser;
      group.users = [isUser];
      group = await this.groupRepository.save(group);
      client.join(group.id);
      this.server.to(group.id).emit('createGroup', {
        code: 'success',
        msg: `成功创建群${data.groupName}`,
        data: group,
      });
    } else {
      this.server
        .to(userId)
        .emit('error', { code: 'error', msg: `你没资格创建群` });
    }
  }

  @SubscribeMessage('addGroup')
  async addGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AddGroupDto,
  ) {
    const isUser = await this.userRepository.findOneBy({ id: data.userId });
    if (isUser) {
      const group = await this.groupRepository.findOne({
        where: {
          id: data.groupId,
        },
        relations: ['users', 'groupMessages', 'groupMessages.user'],
      });
      let userGroup = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.users', 'user')
        .where('group.id = :groupId', { groupId: data.groupId })
        .andWhere('user.id = :userId', { userId: data.userId })
        .getOne();
      const user = isUser;
      if (group && user && !userGroup) {
        group.users.push(user);
        userGroup = await this.groupRepository.save(group);
        client.join(userGroup.id);
        this.server.to(userGroup.id).emit('addGroup', {
          code: 'success',
          msg: `${user.username}加入群${group.groupName}`,
          data: userGroup,
        });
      } else {
        this.server
          .to(data.userId)
          .emit('error', { code: 'error', msg: '进群失败', data: '' });
      }
    } else {
      this.server
        .to(data.userId)
        .emit('error', { code: 'error', msg: '你没资格进群' });
    }
  }
  @SubscribeMessage('exitGroup')
  async exitGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ExitGroupDto,
  ) {
    const isUser = await this.userRepository.findOneBy({ id: data.userId });
    if (isUser) {
      const group = await this.groupRepository.findOne({
        where: {
          id: data.groupId,
        },
        relations: ['users'],
      });
      const userGroup = group.users.findIndex((r) => {
        return r.id == data.userId;
      });
      if (userGroup != -1) {
        group.users.splice(userGroup, 1);
        this.groupRepository.save(group);
        this.server.to(data.userId).emit('exitGroup', {
          code: 'success',
          msg: '退群成功',
          data: data,
        });
        client.rooms.delete(data.groupId);
      } else {
        this.server
          .to(data.userId)
          .emit('exitGroup', { code: 'error', msg: '退群失败' });
      }
    } else {
      this.server
        .to(data.userId)
        .emit('exitGroup', { code: 'error', msg: '退群失败' });
    }
  }
  @SubscribeMessage('deleteFriend')
  async deleteFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: deleteFriendDto,
  ) {
    const user = await this.userRepository.findOne({
      relations: ['friends'],
      where: { id: data.userId },
    });
    const friend = await this.userRepository.findOne({
      relations: ['friends'],
      where: { id: data.friendId },
    });
    const userFriendIndex = user.friends.findIndex(
      (user) => user.id === data.friendId,
    );
    const friendUserIndex = friend.friends.findIndex(
      (user) => user.id === data.userId,
    );
    if (user && friend && friendUserIndex != -1 && userFriendIndex != -1) {
      user.friends.splice(userFriendIndex, 1);
      friend.friends.splice(friendUserIndex, 1);
      this.userRepository.save([user, friend]);
      this.server.to(data.userId).emit('deleteFriend', {
        code: 'success',
        msg: '删好友成功',
        data: data,
      });
      this.server.to(data.friendId).emit('deleteFriend', {
        code: 'success',
        msg: `用户 ${user.nickname} 已你的删除好友`,
        data: data,
      });
    } else {
      this.server
        .to(data.userId)
        .emit('deleteFriend', { code: 'error', msg: '删好友失败' });
    }
  }
}
