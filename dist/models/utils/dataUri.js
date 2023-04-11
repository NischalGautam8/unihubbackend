"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("datauri/parser"));
const path_1 = __importDefault(require("path"));
const getDataUri = (file) => {
    const parser = new parser_1.default();
    const extName = path_1.default.extname(file.originalname).toString();
    console.log(extName);
    return parser.format(extName, file.buffer);
};
exports.default = getDataUri;
