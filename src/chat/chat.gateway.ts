import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  private clientsArr: any[] = [];

  handleConnection(client: Socket) {
    client.join('114514');
    console.log('有人链接了' + client);
    console.log('有人链接了' + client.id);
    client.emit('createChat', 'Server AddCart Ok');
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage('createChat')
  create(client: Socket, createChatDto: CreateChatDto) {
    let userIdArr = Object.values(this.server.engine.clients).map((item) => {
      // @ts-ignore;
      return item.request._query.userId;
    });
    userIdArr = Array.from(new Set(userIdArr));
    console.log(createChatDto);
    this.server.emit('createChat', createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
