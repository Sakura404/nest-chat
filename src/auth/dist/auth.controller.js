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
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.login = function (user, request) {
        return this.authService.login(request.user);
    };
    AuthController.prototype.create = function (createUserDto) {
        return this.authService.register(createUserDto);
    };
    AuthController.prototype.isLogin = function () {
        return true;
    };
    __decorate([
        common_1.UseGuards(passport_1.AuthGuard('local')),
        common_1.Post('/login'),
        __param(0, common_1.Body()), __param(1, common_1.Req())
    ], AuthController.prototype, "login");
    __decorate([
        common_1.Post('/register'),
        __param(0, common_1.Body())
    ], AuthController.prototype, "create");
    __decorate([
        common_1.UseGuards(passport_1.AuthGuard('jwt')),
        common_1.Get('/islogin')
    ], AuthController.prototype, "isLogin");
    AuthController = __decorate([
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
        common_1.Controller('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
