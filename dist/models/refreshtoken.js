"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refreshtoken = new mongoose_1.default.Schema({
    token: String,
    user: {
        type: mongoose_1.default.Types.ObjectId,
    },
});
const refreshTokenModel = mongoose_1.default.model("refreshtoken", refreshtoken);
exports.default = refreshTokenModel;
