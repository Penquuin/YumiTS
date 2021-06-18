"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionHandler = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const constants_json_1 = require("../constants.json");
const rrJSON = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
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
        const rr = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
        switch (emoji_id) {
            case rr.Friendz.Emoji.Id:
                this.securedAddRole(this.roles.Friendz, member);
                break;
            case rr.IdentityV.Emoji.Id:
                this.securedAddRole(this.roles.IdentityV, member);
                break;
            case rr.Studying.Emoji.Id:
                this.securedAddRole(this.roles.Studying, member);
                break;
            case rr.OpenDM.Emoji.Id:
                this.securedAddRole(this.roles.OpenDM, member);
                break;
            case rr.ClosedDM.Emoji.Id:
                this.securedAddRole(this.roles.ClosedDM, member);
                break;
            case rr.Minecraft.Emoji.Id:
                this.securedAddRole(this.roles.Minecraft, member);
                break;
            default:
                break;
        }
    }
    securedAddRole(role, member, shutup) {
        const got = member.roles.cache.find((r) => r.id === role.id);
        if (!got) {
            member.roles.add(role.id);
            if (shutup)
                return;
            member.createDM().then(channel => {
                channel.send(`☑已將你設為${role.name}!\nWe've configured you the ${role.name} role.`);
            }).catch(() => { });
        }
    }
    securedRemoveRole(role, member, shutup) {
        const got = member.roles.cache.find((r) => r.id === role.id);
        if (got) {
            member.roles.remove(got.id);
            if (shutup)
                return;
            member.createDM().then(channel => {
                channel.send(`💥已將你移除${role.name}!\nWe've removed the ${role.name} role from you.`);
            }).catch(() => { });
        }
    }
    removeFate(emoji_id, member, shutup) {
        const pseudo = (role, mem) => {
            this.securedRemoveRole(role, mem, shutup);
        };
        switch (emoji_id) {
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Friendz.Emoji.Id:
                pseudo(this.roles.Friendz, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.IdentityV.Emoji.Id:
                pseudo(this.roles.IdentityV, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Studying.Emoji.Id:
                pseudo(this.roles.Studying, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.OpenDM.Emoji.Id:
                pseudo(this.roles.OpenDM, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.ClosedDM.Emoji.Id:
                pseudo(this.roles.ClosedDM, member);
                break;
            case constants_json_1.Guilds.Friendz_Zone.ReactionRoles.Minecraft.Emoji.Id:
                pseudo(this.roles.Minecraft, member);
                break;
            default:
                break;
        }
    }
    handleDMReaction(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const rr = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
            message.react(rr.ClosedDM.Emoji.Id);
            message.react(rr.OpenDM.Emoji.Id);
            const filter = (reaction, user) => {
                return [rr.OpenDM.Emoji.Id, rr.ClosedDM.Emoji.Id].includes(reaction.emoji.id);
            };
            this.client.on("messageReactionAdd", (r, user) => {
                if (user.bot)
                    return;
                if (!filter(r, user))
                    return;
                const member = message.guild.members.cache.find((m) => m.user.id == user.id);
                if (!member)
                    return;
                //clean the other reactions
                r.message.reactions.cache.forEach((otherR) => {
                    if (otherR.emoji.id === r.emoji.id)
                        return;
                    const got = otherR.users.cache.get(user.id);
                    if (got !== undefined)
                        otherR.users.remove(got);
                });
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
                let shutup = (member.roles.cache.has(rr.OpenDM.Id) && member.roles.cache.has(rr.ClosedDM.Id)) && true || false;
                this.removeFate(r.emoji.id, member, shutup);
            });
        });
    }
    handleReactionCollector(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const rr = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#ffcccc")
                .setTitle("身分組ROLES")
                .setAuthor("Penquuin")
                .setFooter("Service by Yumi with 💙")
                .setDescription("以下說明可確保您通過反應為您選擇正確的角色\nThe following instructions ensure you to choose the right role for you via reactions.")
                .addField("聊天區Friendz Zone", `${this.toEmojiFormat(rrJSON.Friendz.Emoji.Id, rrJSON.Friendz.Emoji.Name)}`, false)
                .addField("第五人格Identity V", `${this.toEmojiFormat(rrJSON.IdentityV.Emoji.Id, rrJSON.IdentityV.Emoji.Name)}`, false)
                .addField("讀書區Studying", `${this.toEmojiFormat(rrJSON.Studying.Emoji.Id, rrJSON.Studying.Emoji.Name)}`, false)
                .addField("麥塊Minecraft", `${this.toEmojiFormat(rrJSON.Minecraft.Emoji.Id, rr.Minecraft.Emoji.Name)}`, false);
            message.edit(embed);
            message.react(rr.Friendz.Emoji.Id);
            message.react(rr.IdentityV.Emoji.Id);
            message.react(rr.Studying.Emoji.Id);
            message.react(rr.Minecraft.Emoji.Id);
            const filter = (reaction, _) => {
                return [rr.Friendz.Emoji.Id, rr.IdentityV.Emoji.Id, rr.Studying.Emoji.Id, rr.Minecraft.Emoji.Id].includes(reaction.emoji.id);
            };
            const simCall = (add, r, user) => {
                if (user.bot)
                    return;
                if (!filter(r, user))
                    return;
                const member = message.guild.members.cache.find((m) => m.user.id == user.id);
                if (!member)
                    return;
                if (add) {
                    this.conductFate(r.emoji.id, member);
                }
                else {
                    this.removeFate(r.emoji.id, member);
                }
            };
            this.client.on("messageReactionAdd", (r, user) => {
                simCall(true, r, user);
            });
            this.client.on("messageReactionRemove", (r, user) => {
                simCall(false, r, user);
            });
        });
    }
    /**
     * A function to initialize the Reaction for Frienz Zone.
    */
    intialize(client) {
        this.client = client;
        const guild = client.guilds.cache.get(constants_json_1.Guilds.Friendz_Zone.Id);
        //ROLES FIRST
        const rr = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
        this.roles.IdentityV = guild.roles.cache.get(rr.IdentityV.Id);
        this.roles.Friendz = guild.roles.cache.get(rr.Friendz.Id);
        this.roles.Studying = guild.roles.cache.get(rr.Studying.Id);
        this.roles.OpenDM = guild.roles.cache.get(rr.OpenDM.Id);
        this.roles.ClosedDM = guild.roles.cache.get(rr.ClosedDM.Id);
        this.roles.Minecraft = guild.roles.cache.get(rr.Minecraft.Id);
        //-----------
        const channel = guild.channels.cache.get(constants_json_1.Guilds.Friendz_Zone.ReactionChannel.Id);
        if (channel == null) {
            console.warn("No channel for reaction was found! Preparing to dispose this run...");
            return;
        }
        channel.messages.fetch("853960134363316254").then((visMsg) => __awaiter(this, void 0, void 0, function* () {
            const dmMsg = yield channel.messages.fetch("854533926231212032").catch(() => undefined);
            if (dmMsg !== undefined) {
                //recover the one who reacted while the bot is offline
                const r1 = dmMsg.reactions.cache.first();
                const r2 = dmMsg.reactions.cache.last();
                const l1 = yield r1.users.fetch().catch(() => undefined);
                const l2 = yield r2.users.fetch().catch(() => undefined);
                guild.members.cache.forEach((member) => {
                    if (member.user.bot)
                        return;
                    const got1 = l1.get(member.user.id);
                    const got2 = l2.get(member.user.id);
                    if (got1 && got2) {
                        r1.users.remove(member.user);
                        r2.users.remove(member.user);
                        return;
                    }
                    if (got1) {
                        this.conductFate(r1.emoji.id, member);
                        this.removeFate(r2.emoji.id, member, true);
                    }
                    else if (got2) {
                        this.conductFate(r2.emoji.id, member);
                        this.removeFate(r1.emoji.id, member, true);
                    }
                    else {
                        this.removeFate(r1.emoji.id, member, false);
                        this.removeFate(r2.emoji.id, member, false);
                    }
                });
                this.handleDMReaction(dmMsg);
            }
            else {
                console.log("No previous DM reaction message was found, proceed to create new one!");
                const rrJSON = constants_json_1.Guilds.Friendz_Zone.ReactionRoles;
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ffcccc")
                    .setTitle("私訊角色DM ROLES")
                    .setAuthor("Penquuin")
                    .setFooter("Service by Yumi with 💙")
                    .setDescription("以下說明可確保您通過反應為您選擇正確的角色\nThe following instructions ensure you to choose the right role for you via reactions.")
                    .addField("可私Open DM", `${this.toEmojiFormat(rrJSON.OpenDM.Emoji.Id, rrJSON.OpenDM.Emoji.Name)}`, false)
                    .addField("不可私Closed DM", `${this.toEmojiFormat(rrJSON.ClosedDM.Emoji.Id, rrJSON.ClosedDM.Emoji.Name)}`, false);
                channel.send(embed).then(msg => this.handleDMReaction(msg));
            }
            if (visMsg !== undefined) {
                //recover the one who reacted while the bot is offline
                visMsg.reactions.cache.forEach((Reaction) => {
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
                this.handleReactionCollector(visMsg);
            }
            else {
                console.log("No previous reaction message was found, proceed to create new one!");
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ffcccc")
                    .setTitle("身分組ROLES")
                    .setAuthor("Penquuin")
                    .setFooter("Service by Yumi with 💙")
                    .setDescription("以下說明可確保您通過反應為您選擇正確的角色\nThe following instructions ensure you to choose the right role for you via reactions.")
                    .addField("聊天區Friendz Zone", `${this.toEmojiFormat(rrJSON.Friendz.Emoji.Id, rrJSON.Friendz.Emoji.Name)}`, false)
                    .addField("第五人格Identity V", `${this.toEmojiFormat(rrJSON.IdentityV.Emoji.Id, rrJSON.IdentityV.Emoji.Name)}`, false)
                    .addField("讀書區Studying", `${this.toEmojiFormat(rrJSON.Studying.Emoji.Id, rrJSON.Studying.Emoji.Name)}`, false)
                    .addField("麥塊Minecraft", `${this.toEmojiFormat(rrJSON.Minecraft.Emoji.Id, rr.Minecraft.Emoji.Name)}`, false);
                channel.send(embed).then(msg => this.handleReactionCollector(msg));
            }
        }));
    }
};
ReactionHandler = __decorate([
    inversify_1.injectable()
], ReactionHandler);
exports.ReactionHandler = ReactionHandler;
//# sourceMappingURL=reaction-handler.js.map