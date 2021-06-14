"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionHandler = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const constants_json_1 = require("../constants.json");
let ReactionHandler = class ReactionHandler {
    constructor() {
        this.roles = {};
    }
    toEmojiFormat(Id, Name) {
        return `<:${Name}:${Id}>`;
    }
    /**
     *
     * @param emoji_id The emoji's id =.=
     * @param member Ok the member who reacted to this, simple.
     */
    conductFate(emoji_id, member) {
        switch (emoji_id) {
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Friendz.Emoji.Id:
                this.securedAddRole(this.roles.Friendz, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.IdentityV.Emoji.Id:
                this.securedAddRole(this.roles.IdentityV, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Studying.Emoji.Id:
                this.securedAddRole(this.roles.Studying, member);
                break;
            default:
                break;
        }
    }
    securedAddRole(role, member) {
        const got = member.roles.cache.find((r) => r.id === role.id);
        if (!got) {
            member.roles.add(role.id);
            member.createDM().then(channel => {
                channel.send(`☑已將你設為${role.name}!\nWe've configured you the ${role.name} role.`);
            }).catch(() => { });
        }
    }
    securedRemoveRole(role, member) {
        const got = member.roles.cache.find((r) => r.id === role.id);
        if (got) {
            member.roles.remove(got.id);
            member.createDM().then(channel => {
                channel.send(`💥已將你移除${role.name}!\nWe've removed the ${role.name} role from you.`);
            }).catch(() => { });
        }
    }
    removeFate(emoji_id, member) {
        switch (emoji_id) {
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Friendz.Emoji.Id:
                this.securedRemoveRole(this.roles.Friendz, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.IdentityV.Emoji.Id:
                this.securedRemoveRole(this.roles.IdentityV, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Studying.Emoji.Id:
                this.securedRemoveRole(this.roles.Studying, member);
                break;
            default:
                break;
        }
    }
    handleReactionCollector(message) {
        const rr = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
        message.react(rr.Friendz.Emoji.Id);
        message.react(rr.IdentityV.Emoji.Id);
        message.react(rr.Studying.Emoji.Id);
        const filter = (reaction, user) => {
            return [rr.Friendz.Emoji.Id, rr.IdentityV.Emoji.Id, rr.Studying.Emoji.Id].includes(reaction.emoji.id);
        };
        this.client.on("messageReactionAdd", (r, user) => {
            if (user.bot)
                return;
            if (!filter(r, user))
                return;
            const member = message.guild.members.cache.find((m) => m.user.id == user.id);
            if (!member)
                return;
            this.conductFate(r.emoji.id, member);
        });
        this.client.on("messageReactionRemove", (r, user) => {
            if (user.bot)
                return;
            if (!filter(r, user))
                return;
            const member = message.guild.members.cache.find((m) => m.user.id == user.id);
            if (!member)
                return;
            this.removeFate(r.emoji.id, member);
        });
    }
    /**
     * A function to initialize the Reaction for Frienz Zone.
    */
    intialize(client) {
        this.client = client;
        const guild = client.guilds.cache.get(constants_json_1.Guilds.Friendz_Zone.Id);
        //ROLES FIRST
        this.roles.IdentityV = guild.roles.cache.get(constants_json_1.Guilds.Friendz_Zone.ReactionRoles.IdentityV.Id);
        this.roles.Friendz = guild.roles.cache.get(constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Friendz.Id);
        this.roles.Studying = guild.roles.cache.get(constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Studying.Id);
        //-----------
        const channel = guild.channels.cache.get(constants_json_1.Guilds.Friendz_Zone.ReactionChannel.Id);
        if (channel == null) {
            console.warn("No channel for reaction was found! Preparing to dispose this run...");
            return;
        }
        channel.messages.fetch("853960134363316254").then(message => {
            if (message) {
                //recover the one who reacted while the bot is offline
                message.reactions.cache.forEach((Reaction) => {
                    const rum = Reaction.users;
                    rum.fetch().then(x => {
                        guild.members.cache.forEach((member) => {
                            if (member.user.bot)
                                return;
                            const got = x.get(member.user.id);
                            if (got) {
                                this.conductFate(Reaction.emoji.id, member);
                            }
                            else {
                                this.removeFate(Reaction.emoji.id, member);
                            }
                        });
                    });
                });
                this.handleReactionCollector(message);
            }
            else {
                console.log("No previous reaction message was found, proceed to create new one!");
                const rrJSON = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ffcccc")
                    .setTitle("身分組ROLES")
                    .setAuthor("Penquuin")
                    .setFooter("Service by Yumi with 💙")
                    .setDescription("以下說明可確保您通過反應為您選擇正確的角色\nThe following instructions ensure you to choose the right role for you via reactions.")
                    .addField("聊天區Friendz Zone", `${this.toEmojiFormat(rrJSON.Friendz.Emoji.Id, rrJSON.Friendz.Emoji.Name)}`, false)
                    .addField("第五人格Identity V", `${this.toEmojiFormat(rrJSON.IdentityV.Emoji.Id, rrJSON.IdentityV.Emoji.Name)}`, false)
                    .addField("讀書區Studying", `${this.toEmojiFormat(rrJSON.Studying.Emoji.Id, rrJSON.Studying.Emoji.Name)}`, false);
                channel.send(embed).then(msg => this.handleReactionCollector(msg));
            }
        });
    }
};
ReactionHandler = __decorate([
    inversify_1.injectable()
], ReactionHandler);
exports.ReactionHandler = ReactionHandler;
//# sourceMappingURL=reaction-handler.js.map