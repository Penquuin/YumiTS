"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CommandPrettifier_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPrettifier = void 0;
const inversify_1 = require("inversify");
const constants_json_1 = require("../constants.json");
let CommandPrettifier = CommandPrettifier_1 = class CommandPrettifier {
    /**
     * Prettify
     * @param input The original message (No matter cases.)
     * @returns {string | void} If it's a command then prettify it, else return void.
     */
    Prettify(input) {
        input = input.toLowerCase();
        input = input.trim();
        if (input.charAt(0) === CommandPrettifier_1.prefix) {
            return input.substring(1);
        }
        else {
            return null;
        }
    }
};
CommandPrettifier.prefix = constants_json_1.Prefix;
CommandPrettifier = CommandPrettifier_1 = __decorate([
    inversify_1.injectable()
], CommandPrettifier);
exports.CommandPrettifier = CommandPrettifier;
//# sourceMappingURL=command-prettifier.js.map