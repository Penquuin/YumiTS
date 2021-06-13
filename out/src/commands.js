"use strict";
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
exports.CommandClass = exports.Commands = void 0;
const child_process_1 = require("child_process");
const constants_json_1 = require("./constants.json");
class CommandFormat {
    constructor(arg_types) {
        this.arg_types = arg_types;
    }
    /**
     * Verify
     * @param refinedContent The content that it parses, CJ.
     */
    Verify(refinedContent) {
        if (refinedContent.Args.length < this.arg_types.length)
            return false;
        for (let index = 0; index < this.arg_types.length; index++) {
            const the_type = this.arg_types[index];
            const the_arg = refinedContent.Args[index];
            switch (the_type) {
                case "boolean": //so? check bool, fool!
                    if (the_arg !== "true" && the_arg !== "false") {
                        return false;
                    }
                    break;
                case "number": //ok check if it's a number
                    if (Number(the_arg) === NaN) {
                        return false;
                    }
                case "string": //lol it's string, ok?
                    break;
                default:
                    break;
            }
        }
        return true;
    }
    toString(name) {
        let str = constants_json_1.Prefix + name;
        this.arg_types.forEach((arg) => {
            str += (" <" + arg + ">");
        });
        return str;
    }
}
class Command {
    constructor(commandName, callback, commandFormat, guild) {
        this.callback = callback;
        this.name = commandName;
        this.guild = guild;
        this.commandFormat = commandFormat;
        this.middleman = (msg, rc) => {
            if (!msg.guild) {
                easyReply(msg, `Currently the bot\n**DOES NOT** support DM commands.`);
                return;
            }
            if (!this.commandFormat.Verify(rc)) {
                easyReply(msg, `Correct Format:\n${this.getError()}`);
                return;
            }
            this.callback(msg, rc);
        };
    }
    getError() {
        let he = this.commandFormat.toString(this.name);
        if (this.guild) {
            return he + ` (Limit to ${this.guild.name})`;
        }
        else {
            return he + ` (Global)`;
        }
    }
}
exports.CommandClass = Command;
function easyReply(message, toSend) {
    return message.channel.send(`<@${message.author.id}> ${toSend}`);
}
let here = [
    new Command("ping", (message, refinedContent) => __awaiter(void 0, void 0, void 0, function* () {
        message.reply("Pong!");
    }), new CommandFormat([])),
    new Command("test", (message, refinedContent) => __awaiter(void 0, void 0, void 0, function* () {
        easyReply(message, "Executing tests...")
            .then(msg => {
            const output = child_process_1.execSync('npm test', { encoding: 'utf-8' });
            msg.edit(`<@${message.author.id}>Unit test executed!` + "\n```" + output + "\n```").catch(() => { });
        }).catch(() => { });
    }), new CommandFormat([])),
    new Command("print", (message, refinedContent) => __awaiter(void 0, void 0, void 0, function* () {
        easyReply(message, refinedContent.Args[0]);
    }), new CommandFormat(["string"])),
    new Command("help", (message, refinedContent) => {
        easyReply(message, "Sending help, check your DM!")
            .then(sent => {
            message.author.createDM().then(channel => {
                let tosend = "";
                for (let i = 0; i < here.length; i++) {
                    const cmd = here[i];
                    tosend += `\n${i + 1}. ${cmd.getError()}`;
                }
                channel.send(`<@${message.author.id}> Help arrived!\n\`\`\`` + tosend + "\n```")
                    .catch(() => {
                    sent.delete();
                    easyReply(message, `\n⚠Please turn DM on!⚠`);
                });
            }).catch(() => {
                sent.delete();
                easyReply(message, `\n⚠Please turn DM on!⚠`);
            });
        });
    }, new CommandFormat([]))
];
exports.Commands = here;
//# sourceMappingURL=commands.js.map