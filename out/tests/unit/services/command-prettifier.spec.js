"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const command_prettifier_1 = require("../../../src/services/command-prettifier");
describe('CommandPrettifier', () => {
    let service;
    beforeEach(() => {
        service = new command_prettifier_1.CommandPrettifier();
    });
    it("should prettify command", () => {
        chai_1.expect(service.Prettify("?tTest")).to.be.not.null;
    });
    it("should not prettify non command", () => {
        chai_1.expect(service.Prettify("test without prefix")).to.be.null;
    });
});
//# sourceMappingURL=command-prettifier.spec.js.map