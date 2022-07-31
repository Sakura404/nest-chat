"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var user_module_1 = require("./user/user.module");
var group_module_1 = require("./group/group.module");
var friend_module_1 = require("./friend/friend.module");
var auth_module_1 = require("./auth/auth.module");
var chat_module_1 = require("./chat/chat.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRoot({
                    logging: ['error'],
                    type: 'mysql',
                    host: process.env.DATABASE_HOST,
                    port: 3306,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_DATABASE,
                    entities: ['dist/**/entities/*.entity{.ts,.js}'],
                    synchronize: true,
                    entityPrefix: 'nc_'
                }),
                user_module_1.UserModule,
                group_module_1.GroupModule,
                friend_module_1.FriendModule,
                auth_module_1.AuthModule,
                chat_module_1.ChatModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
