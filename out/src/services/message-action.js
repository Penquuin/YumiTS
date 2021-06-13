"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAction = void 0;
const ping_finder_1 = require("./ping-finder");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const commands_1 = require("../commands");
const command_prettifier_1 = require("./command-prettifier");
const refined_content_1 = require("./refined-content");
let here = new command_prettifier_1.CommandPrettifier();
let MessageAction = class MessageAction {
    constructor(pingFinder) {
        this.pingFinder = pingFinder;
    }
    handle(message) {
        let prettified = here.Prettify(message.content);
        if (prettified) {
            let ultra = new refined_content_1.RefinedContent(prettified);
            let found = commands_1.Commands.find((element) => element.name === ultra.Command);
            //passed!
            if (found) {
                found.middleman(message, ultra);
            }
        }
        return Promise.reject();
    }
};
MessageAction = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PingFinder)),
    __metadata("design:paramtypes", [ping_finder_1.PingFinder])
], MessageAction);
exports.MessageAction = MessageAction;
//# sourceMappingURL=message-action.js.map