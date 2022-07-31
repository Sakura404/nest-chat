"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GroupMessage = exports.Group = void 0;
var user_entity_1 = require("src/user/entities/user.entity");
var typeorm_1 = require("typeorm");
var Group = /** @class */ (function () {
    function Group() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Group.prototype, "id");
    __decorate([
        typeorm_1.OneToOne(function (type) { return user_entity_1.User; }),
        typeorm_1.JoinColumn()
    ], Group.prototype, "user");
    __decorate([
        typeorm_1.Column()
    ], Group.prototype, "groupName");
    __decorate([
        typeorm_1.Column({ "default": '群主很懒,没写公告' })
    ], Group.prototype, "notice");
    __decorate([
        typeorm_1.Column({
            name: 'create_time',
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP'; }
        })
    ], Group.prototype, "createTime");
    __decorate([
        typeorm_1.Column({
            name: 'update_time',
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP'; }
        })
    ], Group.prototype, "updateTime");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return user_entity_1.User; }),
        typeorm_1.JoinTable({ name: 'group_user' })
    ], Group.prototype, "users");
    __decorate([
        typeorm_1.OneToMany(function () { return GroupMessage; }, function (GroupMessage) { return GroupMessage.group; })
    ], Group.prototype, "groupMessages");
    Group = __decorate([
        typeorm_1.Entity()
    ], Group);
    return Group;
}());
exports.Group = Group;
var GroupMessage = /** @class */ (function () {
    function GroupMessage() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], GroupMessage.prototype, "id");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }),
        typeorm_1.JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    ], GroupMessage.prototype, "user");
    __decorate([
        typeorm_1.Column()
    ], GroupMessage.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function () { return Group; }, function (group) { return group.groupMessages; }),
        typeorm_1.JoinColumn()
    ], GroupMessage.prototype, "group");
    __decorate([
        typeorm_1.Column()
    ], GroupMessage.prototype, "content");
    __decorate([
        typeorm_1.Column({ "default": 'text' })
    ], GroupMessage.prototype, "messageType");
    __decorate([
        typeorm_1.Column({
            name: 'create_time',
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP'; }
        })
    ], GroupMessage.prototype, "createTime");
    GroupMessage = __decorate([
        typeorm_1.Entity()
    ], GroupMessage);
    return GroupMessage;
}());
exports.GroupMessage = GroupMessage;
