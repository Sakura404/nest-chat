"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GroupModule = void 0;
var common_1 = require("@nestjs/common");
var group_service_1 = require("./group.service");
var group_controller_1 = require("./group.controller");
var group_entity_1 = require("./entities/group.entity");
var typeorm_1 = require("@nestjs/typeorm");
var GroupModule = /** @class */ (function () {
    function GroupModule() {
    }
    GroupModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([group_entity_1.Group])],
            controllers: [group_controller_1.GroupController],
            providers: [group_service_1.GroupService]
        })
    ], GroupModule);
    return GroupModule;
}());
exports.GroupModule = GroupModule;
