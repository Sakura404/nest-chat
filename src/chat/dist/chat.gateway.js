"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var group_entity_1 = require("src/group/entities/group.entity");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("src/user/entities/user.entity");
var friend_entity_1 = require("src/friend/entities/friend.entity");
var common_1 = require("@nestjs/common");
var ChatGateway = /** @class */ (function () {
    function ChatGateway(userRepository, groupRepository, groupMessageRepository, friendMessageRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.friendMessageRepository = friendMessageRepository;
        this.clientsArr = [];
        this.defaultGroup = '默认群组';
    }
    ChatGateway.prototype.handleConnection = function (client) {
        var userRoom = client.handshake.query.userId; //连接需要传入userId参数
        client.join(this.defaultGroup);
        if (userRoom) {
            client.join(userRoom);
        }
        console.log('连接成功');
        return '连接成功';
    };
    ChatGateway.prototype.handleDisconnect = function (client) { };
    ChatGateway.prototype.sendFriendMessage = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var isUser, userFriendMap, FriendMessage_1, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: data.userId }
                        })];
                    case 1:
                        isUser = _c.sent();
                        if (!isUser) return [3 /*break*/, 6];
                        console.log(123);
                        return [4 /*yield*/, this.userRepository
                                .createQueryBuilder('user')
                                .leftJoinAndSelect('user.friends', 'user1', 'user1.id= :friendId', {
                                friendId: data.friendId
                            })
                                .where('user.id= :userId', { userId: data.userId })
                                .getOne()];
                    case 2:
                        userFriendMap = _c.sent();
                        if (!userFriendMap || !data.friendId) {
                            this.server.to(data.userId).emit('error', {
                                code: 'error',
                                msg: '朋友消息发送错误',
                                data: ''
                            });
                            return [2 /*return*/];
                        }
                        data.time = new Date().valueOf();
                        FriendMessage_1 = this.friendMessageRepository.create(data);
                        _a = FriendMessage_1;
                        return [4 /*yield*/, this.userRepository.findOneBy({
                                id: data.friendId
                            })];
                    case 3:
                        _a.friend = _c.sent();
                        _b = FriendMessage_1;
                        return [4 /*yield*/, this.userRepository.findOneBy({
                                id: data.userId
                            })];
                    case 4:
                        _b.user = _c.sent();
                        return [4 /*yield*/, this.friendMessageRepository.save(FriendMessage_1)];
                    case 5:
                        _c.sent();
                        this.server.to(data.userId).to(data.friendId).emit('friendMessage', {
                            code: 'success',
                            msg: '',
                            data: FriendMessage_1
                        });
                        _c.label = 6;
                    case 6:
                        console.log(123);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.sendGroupMessage = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var isUser, userGroupMap, GroupMessage_1, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { id: data.userId }
                        })];
                    case 1:
                        isUser = _c.sent();
                        if (!isUser) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.groupRepository
                                .createQueryBuilder('group')
                                .leftJoinAndSelect('group.users', 'user')
                                .where('group.id = :groupId', { groupId: data.groupId })
                                .andWhere('user.id = :userId', { userId: data.userId })
                                .getOne()];
                    case 2:
                        userGroupMap = _c.sent();
                        if (!userGroupMap || !data.groupId) {
                            this.server.to(data.userId).emit('error', {
                                code: 'error',
                                msg: '群消息发送错误',
                                data: ''
                            });
                            return [2 /*return*/];
                        }
                        data.time = new Date().valueOf();
                        GroupMessage_1 = this.groupMessageRepository.create(data);
                        _a = GroupMessage_1;
                        return [4 /*yield*/, this.groupRepository.findOneBy({
                                id: data.groupId
                            })];
                    case 3:
                        _a.group = _c.sent();
                        _b = GroupMessage_1;
                        return [4 /*yield*/, this.userRepository.findOneBy({
                                id: data.userId
                            })];
                    case 4:
                        _b.user = _c.sent();
                        return [4 /*yield*/, this.groupMessageRepository.save(GroupMessage_1)];
                    case 5:
                        _c.sent();
                        this.server
                            .to(data.groupId)
                            .emit('groupMessage', { code: 'success', msg: '', data: GroupMessage_1 });
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getGroups = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = client.handshake.query.userId;
                        return [4 /*yield*/, this.groupRepository
                                .createQueryBuilder('group')
                                .leftJoinAndSelect('group.users', 'user')
                                .leftJoinAndSelect('group.groupMessages', 'groupMessage')
                                .leftJoinAndSelect('groupMessage.user', 'user1')
                                .where('user.id = :userId', { userId: userId })
                                .orderBy('groupMessage.createTime', 'DESC')
                                .getMany()];
                    case 1:
                        group = _a.sent();
                        //console.log(group);
                        group.forEach(function (e) {
                            client.join(e.id);
                        });
                        this.server.to(userId).emit('getGroups', {
                            code: 'success',
                            msg: '',
                            data: group
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getFriends = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, friends;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = client.handshake.query.userId;
                        return [4 /*yield*/, this.userRepository
                                .createQueryBuilder('user')
                                .leftJoinAndSelect('user.friends', 'friend')
                                .where('user.id= :userId', { userId: userId })
                                .printSql()
                                .getOne()];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, Promise.all(user.friends.map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                var friendMessages;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.friendMessageRepository
                                                .createQueryBuilder('friendMessage')
                                                .leftJoinAndSelect('friendMessage.user', 'user')
                                                .leftJoinAndSelect('friendMessage.friend', 'friend')
                                                .where("friendMessage.userId= :userId and friendMessage.friendId= :friendId or\n         friendMessage.userId= :friendId and friendMessage.friendId= :userId", { userId: user.id, friendId: element.id })
                                                .orderBy('friendMessage.createTime', 'DESC')
                                                .getMany()];
                                        case 1:
                                            friendMessages = _a.sent();
                                            element.friendMessages = friendMessages;
                                            return [2 /*return*/, element];
                                    }
                                });
                            }); }))];
                    case 2:
                        friends = _a.sent();
                        this.server.to(userId).emit('getFriends', {
                            code: 'success',
                            msg: '',
                            data: friends
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.addFriend = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isUser, relation, friendRoom, friend, user, s, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = client.handshake.query.userId;
                        if (userId != data.userId) {
                            this.server
                                .to(userId)
                                .emit('error', { code: 'FAIL', msg: '非法操作', data: '' });
                        }
                        return [4 /*yield*/, this.userRepository.findOneBy({ id: data.userId })];
                    case 1:
                        isUser = _b.sent();
                        if (!isUser) return [3 /*break*/, 7];
                        if (data.userId === data.friendId) {
                            this.server.to(userId).emit('error', {
                                code: 'FAIL',
                                msg: '不能添加自己为好友',
                                data: ''
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.userRepository
                                .createQueryBuilder('user')
                                .innerJoinAndSelect('user.friends', 'friend', 'friend.id= :friendId or friend.id= :userId', {
                                friendId: data.friendId
                            })
                                .where('user.id= :userId or user.id= :friendId ', {
                                userId: data.userId
                            })
                                .getOne()];
                    case 2:
                        relation = _b.sent();
                        friendRoom = [data.userId, data.friendId]
                            .sort(function (a, b) {
                            return a.localeCompare(b);
                        })
                            .join();
                        if (relation) {
                            this.server.to(data.userId).emit('error', {
                                code: 'FAIL',
                                msg: '已经有该好友',
                                data: data
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['friends'],
                                where: {
                                    id: data.friendId
                                }
                            })];
                    case 3:
                        friend = _b.sent();
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['friends'],
                                where: { id: data.userId }
                            })];
                    case 4:
                        user = _b.sent();
                        if (!friend) {
                            this.server.to(data.userId).emit('error', {
                                code: 'FAIL',
                                msg: '该好友不存在',
                                data: ''
                            });
                            return [2 /*return*/];
                        }
                        user.friends.push(friend);
                        friend.friends.push(user);
                        return [4 /*yield*/, this.userRepository.save([user, friend])];
                    case 5:
                        s = _b.sent();
                        _a = friend;
                        return [4 /*yield*/, this.friendMessageRepository
                                .createQueryBuilder('friendMessage')
                                .leftJoinAndSelect('friendMessage.user', 'user')
                                .leftJoinAndSelect('friendMessage.friend', 'friend')
                                .where("friendMessage.userId= :userId and friendMessage.friendId= :friendId or\n         friendMessage.userId= :friendId and friendMessage.friendId= :userId", { userId: user.id, friendId: friend.id })
                                .orderBy('friendMessage.createTime', 'DESC')
                                .getMany()];
                    case 6:
                        _a.friendMessages = _b.sent();
                        user.friendMessages = friend.friendMessages;
                        //互相引用返回结果会爆栈
                        friend.friends = null;
                        user.friends = null;
                        this.server.to(data.userId).emit('addFriend', {
                            code: 'success',
                            msg: "\u6DFB\u52A0\u597D\u53CB" + friend.username + "\u6210\u529F",
                            data: friend
                        });
                        this.server.to(data.friendId).emit('addFriend', {
                            code: 'success',
                            msg: user.username + "\u6DFB\u52A0\u4F60\u4E3A\u597D\u53CB",
                            data: user
                        });
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.createGroup = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isUser, isHaveGroup, group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = client.handshake.query.userId;
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { id: data.userId }
                            })];
                    case 1:
                        isUser = _a.sent();
                        if (!(isUser && userId == data.userId)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.groupRepository.findOneBy({
                                groupName: data.groupName
                            })];
                    case 2:
                        isHaveGroup = _a.sent();
                        if (isHaveGroup) {
                            this.server.to(userId).emit('error', {
                                code: 'error',
                                msg: '该群名字已存在',
                                data: isHaveGroup
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.groupRepository.create(data)];
                    case 3:
                        group = _a.sent();
                        group.user = isUser;
                        group.users = [isUser];
                        return [4 /*yield*/, this.groupRepository.save(group)];
                    case 4:
                        group = _a.sent();
                        client.join(group.id);
                        this.server.to(group.id).emit('createGroup', {
                            code: 'success',
                            msg: "\u6210\u529F\u521B\u5EFA\u7FA4" + data.groupName,
                            data: group
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        this.server
                            .to(userId)
                            .emit('error', { code: 'error', msg: "\u4F60\u6CA1\u8D44\u683C\u521B\u5EFA\u7FA4" });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.addGroup = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var isUser, group, userGroup, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ id: data.userId })];
                    case 1:
                        isUser = _a.sent();
                        if (!isUser) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.groupRepository.findOne({
                                where: {
                                    id: data.groupId
                                },
                                relations: ['users', 'groupMessages', 'groupMessages.user']
                            })];
                    case 2:
                        group = _a.sent();
                        return [4 /*yield*/, this.groupRepository
                                .createQueryBuilder('group')
                                .leftJoinAndSelect('group.users', 'user')
                                .where('group.id = :groupId', { groupId: data.groupId })
                                .andWhere('user.id = :userId', { userId: data.userId })
                                .getOne()];
                    case 3:
                        userGroup = _a.sent();
                        user = isUser;
                        if (!(group && user && !userGroup)) return [3 /*break*/, 5];
                        group.users.push(user);
                        return [4 /*yield*/, this.groupRepository.save(group)];
                    case 4:
                        userGroup = _a.sent();
                        client.join(userGroup.id);
                        this.server.to(userGroup.id).emit('addGroup', {
                            code: 'success',
                            msg: user.username + "\u52A0\u5165\u7FA4" + group.groupName,
                            data: userGroup
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        this.server
                            .to(data.userId)
                            .emit('error', { code: 'error', msg: '进群失败', data: '' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.server
                            .to(data.userId)
                            .emit('error', { code: 'error', msg: '你没资格进群' });
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.exitGroup = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var isUser, group, userGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ id: data.userId })];
                    case 1:
                        isUser = _a.sent();
                        if (!isUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.groupRepository.findOne({
                                where: {
                                    id: data.groupId
                                },
                                relations: ['users']
                            })];
                    case 2:
                        group = _a.sent();
                        userGroup = group.users.findIndex(function (r) {
                            return r.id == data.userId;
                        });
                        if (userGroup != -1) {
                            group.users.splice(userGroup, 1);
                            this.groupRepository.save(group);
                            this.server.to(data.userId).emit('exitGroup', {
                                code: 'success',
                                msg: '退群成功',
                                data: data
                            });
                            client.rooms["delete"](data.groupId);
                        }
                        else {
                            this.server
                                .to(data.userId)
                                .emit('exitGroup', { code: 'error', msg: '退群失败' });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.server
                            .to(data.userId)
                            .emit('exitGroup', { code: 'error', msg: '退群失败' });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.deleteFriend = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, friend, userFriendIndex, friendUserIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            relations: ['friends'],
                            where: { id: data.userId }
                        })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['friends'],
                                where: { id: data.friendId }
                            })];
                    case 2:
                        friend = _a.sent();
                        userFriendIndex = user.friends.findIndex(function (user) { return user.id === data.friendId; });
                        friendUserIndex = friend.friends.findIndex(function (user) { return user.id === data.userId; });
                        if (user && friend && friendUserIndex != -1 && userFriendIndex != -1) {
                            user.friends.splice(userFriendIndex, 1);
                            friend.friends.splice(friendUserIndex, 1);
                            this.userRepository.save([user, friend]);
                            this.server.to(data.userId).emit('deleteFriend', {
                                code: 'success',
                                msg: '删好友成功',
                                data: data
                            });
                            this.server.to(data.friendId).emit('deleteFriend', {
                                code: 'success',
                                msg: "\u7528\u6237 " + user.nickname + " \u5DF2\u4F60\u7684\u5220\u9664\u597D\u53CB",
                                data: data
                            });
                        }
                        else {
                            this.server
                                .to(data.userId)
                                .emit('deleteFriend', { code: 'error', msg: '删好友失败' });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], ChatGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('friendMessage'),
        __param(0, websockets_1.MessageBody())
    ], ChatGateway.prototype, "sendFriendMessage");
    __decorate([
        websockets_1.SubscribeMessage('groupMessage'),
        __param(0, websockets_1.MessageBody())
    ], ChatGateway.prototype, "sendGroupMessage");
    __decorate([
        websockets_1.SubscribeMessage('getGroups')
    ], ChatGateway.prototype, "getGroups");
    __decorate([
        websockets_1.SubscribeMessage('getFriends')
    ], ChatGateway.prototype, "getFriends");
    __decorate([
        websockets_1.SubscribeMessage('addFriend'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "addFriend");
    __decorate([
        websockets_1.SubscribeMessage('createGroup'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "createGroup");
    __decorate([
        websockets_1.SubscribeMessage('addGroup'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "addGroup");
    __decorate([
        websockets_1.SubscribeMessage('exitGroup'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "exitGroup");
    __decorate([
        websockets_1.SubscribeMessage('deleteFriend'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "deleteFriend");
    ChatGateway = __decorate([
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
        websockets_1.WebSocketGateway({
            //解决与前端socket.io版本不同的问题
            allowEIO3: true,
            cors: {
                origin: true,
                credentials: true
            }
        }),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(1, typeorm_1.InjectRepository(group_entity_1.Group)),
        __param(2, typeorm_1.InjectRepository(group_entity_1.GroupMessage)),
        __param(3, typeorm_1.InjectRepository(friend_entity_1.FriendMessage))
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
