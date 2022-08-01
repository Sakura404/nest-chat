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
exports.GroupController = void 0;
var common_1 = require("@nestjs/common");
var GroupController = /** @class */ (function () {
    function GroupController(groupService) {
        this.groupService = groupService;
    }
    GroupController.prototype.create = function (createGroupDto) {
        return this.groupService.create(createGroupDto);
    };
    GroupController.prototype.findAll = function () {
        return this.groupService.findAll();
    };
    GroupController.prototype.findGroupByLikeName = function (name) {
        return this.groupService.findGroupByLikeName(name);
    };
    GroupController.prototype.update = function (id, updateGroupDto) {
        return this.groupService.update(+id, updateGroupDto);
    };
    GroupController.prototype.remove = function (id) {
        return this.groupService.remove(+id);
    };
    __decorate([
        common_1.Post(),
        __param(0, common_1.Body())
    ], GroupController.prototype, "create");
    __decorate([
        common_1.Get()
    ], GroupController.prototype, "findAll");
    __decorate([
        common_1.Get('search/:name'),
        __param(0, common_1.Param('name'))
    ], GroupController.prototype, "findGroupByLikeName");
    __decorate([
        common_1.Patch(':id'),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], GroupController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id'))
    ], GroupController.prototype, "remove");
    GroupController = __decorate([
        common_1.Controller('group')
    ], GroupController);
    return GroupController;
}());
exports.GroupController = GroupController;
