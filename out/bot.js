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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const message_action_1 = require("./services/message-action");
const reaction_handler_1 = require("./services/reaction-handler");
let Bot = class Bot {
    constructor(client, token, messageAction, reactionHandler) {
        const intents = new discord_js_1.Intents();
        intents.add('DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES');
        this.client = new discord_js_1.Client({ ws: { intents: intents } });
        this.token = token;
        this.messageAction = messageAction;
        this.reactionHandler = reactionHandler;
    }
    listen() {
        this.client.on('message', (message) => {
            this.messageAction.handle(message).then().catch(() => { });
        });
        this.client.on('ready', () => {
            console.log("Logged in!");
            this.setPresence();
            this.reactionHandler.intialize(this.client);
        });
        this.client.login(this.token);
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
    __param(3, inversify_1.inject(types_1.TYPES.ReactionHandler)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, typeof (_a = typeof message_action_1.MessageAction !== "undefined" && message_action_1.MessageAction) === "function" ? _a : Object, reaction_handler_1.ReactionHandler])
], Bot);
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map