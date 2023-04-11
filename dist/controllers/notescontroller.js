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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadNote = void 0;
const notesmodel_1 = __importDefault(require("../models/notesmodel"));
const dataUri_1 = __importDefault(require("../utils/dataUri"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        console.log(file);
        const uri = (0, dataUri_1.default)(file);
        const uploaded = yield cloudinary_1.default.v2.uploader.upload(uri.content);
        console.log(uploaded.bytes);
        const newFile = yield notesmodel_1.default.create({
            name: req.body.name,
            uploadedBy: req.body.uploadedBy,
            size: (uploaded.bytes / 1024) * 1024,
            url: uploaded.secure_url,
        });
        console.log(uploaded.secure_url);
        res.status(200).send("uploaded");
    }
    catch (err) {
        res.status(400).json({ err });
        console.log(err);
    }
});
exports.uploadNote = uploadNote;
