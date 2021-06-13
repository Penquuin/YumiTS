"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefinedContent = void 0;
class RefinedContent {
    constructor(prettified) {
        //split!!!
        let splits = prettified.split(" ");
        this.Command = splits[0];
        splits.shift();
        this.Args = splits;
    }
}
exports.RefinedContent = RefinedContent;
//# sourceMappingURL=refined-content.js.map