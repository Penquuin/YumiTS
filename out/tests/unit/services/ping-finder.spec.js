"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("mocha");
const chai_1 = require("chai");
const ping_finder_1 = require("../../../src/services/ping-finder");
describe('PingFinder', () => {
    let service;
    beforeEach(() => {
        service = new ping_finder_1.PingFinder();
    });
    it('should find "ping" in the string', () => {
        chai_1.expect(service.isPing("ping")).to.be.true;
    });
});
//# sourceMappingURL=ping-finder.spec.js.map