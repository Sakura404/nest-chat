"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FriendMessage = void 0;
var user_entity_1 = require("src/user/entities/user.entity");
var typeorm_1 = require("typeorm");
var FriendMessage = /** @class */ (function () {
    function FriendMessage() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], FriendMessage.prototype, "id");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }),
        typeorm_1.JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    ], FriendMessage.prototype, "user");
    __decorate([
        typeorm_1.Column()
    ], FriendMessage.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }),
        typeorm_1.JoinColumn({ name: 'friendId', referencedColumnName: 'id' })
    ], FriendMessage.prototype, "friend");
    __decorate([
        typeorm_1.Column()
    ], FriendMessage.prototype, "friendId");
    __decorate([
        typeorm_1.Column()
    ], FriendMessage.prototype, "content");
    __decorate([
        typeorm_1.Column()
    ], FriendMessage.prototype, "messageType");
    __decorate([
        typeorm_1.Column({
            name: 'create_time',
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP'; }
        })
    ], FriendMessage.prototype, "createTime");
    FriendMessage = __decorate([
        typeorm_1.Entity()
    ], FriendMessage);
    return FriendMessage;
}());
exports.FriendMessage = FriendMessage;
