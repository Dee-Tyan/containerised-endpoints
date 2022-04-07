"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountNumberGenerator = void 0;
function accountNumberGenerator() {
    let accNumber = "";
    for (let i = 0; i < 11; i++) {
        let current = Math.floor(Math.random() * 10);
        accNumber += current;
    }
    return accNumber;
}
exports.accountNumberGenerator = accountNumberGenerator;
//# sourceMappingURL=accnumgen.js.map