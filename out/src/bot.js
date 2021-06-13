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
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const message_action_1 = require("./services/message-action");
let Bot = class Bot {
    constructor(client, token, messageAction) {
        this.client = client;
        this.token = token;
        this.messageAction = messageAction;
    }
    listen() {
        this.client.on('message', (message) => {
            this.messageAction.handle(message).then().catch(() => { });
        });
        return this.client.login(this.token);
    }
    /**
     * setPresence
     */
    setPresence() {
        let data = {
            status: "online",
            activity: {
                type: "WATCHING",
                name: `${this.client.guilds.cache.size} servers.`
            }
        };
        this.client.user.setPresence(data);
    }
};
Bot = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.Token)),
    __param(2, inversify_1.inject(types_1.TYPES.MessageAction)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, message_action_1.MessageAction])
], Bot);
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map