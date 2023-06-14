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
exports.findNote = exports.getUserNotes = exports.setRating = exports.getRating = exports.getSingleNote = exports.getNotes = exports.uploadNote = void 0;
const notesmodel_1 = __importDefault(require("../models/notesmodel"));
const dataUri_1 = __importDefault(require("../utils/dataUri"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield notesmodel_1.default.findOne({ _id: req.params.id });
        if (!doc)
            return res.status(400).send("not found any note");
        const hashmap = new Map(doc.ratingsMap);
        if (hashmap) {
            console.log(hashmap);
            const size = hashmap.size;
            const sum = Array.from(hashmap.values()).reduce((acc, cur) => acc + Number(cur), 0);
            console.log("sum", sum);
            console.log("size", size);
            return res.status(200).json({
                rating: sum / size,
                noOfRating: size,
                prevRated: hashmap === null || hashmap === void 0 ? void 0 : hashmap.get(req.body.userid),
            });
        }
        return res.status(400).send("not found");
    }
    catch (err) {
        console.log(err);
    }
});
exports.getRating = getRating;
const setRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid, rating } = req.body;
        if (!isFinite(Number(rating))) {
            return res.status(400).send("not a finite value");
        }
        if (Number(rating) > 5) {
            return res.status(400).send("can't rate more than 5");
        }
        const doc = yield notesmodel_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                [`ratingsMap.${userid}`]: rating,
            },
        }, { new: true });
        if (!doc)
            return res.status(400).send("unable to rate the note");
        const hashmap = doc.ratingsMap;
        const size = hashmap === null || hashmap === void 0 ? void 0 : hashmap.size;
        const sum = Array.from(hashmap.values()).reduce((acc, cur) => acc + Number(cur), 0);
        console.log(sum);
        return res.status(200).json({ rating: sum / size });
    }
    catch (err) {
        console.log(err);
    }
});
exports.setRating = setRating;
const getSingleNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        console.log(req.query.userid);
        const note = yield notesmodel_1.default.findOne({ _id: req.params.id }).populate({
            path: "uploadedBy",
            select: "_id username firstName lastName",
        });
        if (note) {
            const hashmap = new Map(note.ratingsMap);
            const size = hashmap.size;
            const sum = Array.from(hashmap.values()).reduce((acc, cur) => acc + Number(cur), 0);
            return res.status(200).json({
                note,
                rating: sum / size,
                noOfRating: size,
                prevRated: (hashmap === null || hashmap === void 0 ? void 0 : hashmap.get(req.query.userid)) || " 0",
            });
        }
        else {
            res.status(400).send("note not found");
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.getSingleNote = getSingleNote;
const getUserNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page || 1;
        const skip = (Number(page) - 1) * 30;
        const userNotes = yield notesmodel_1.default
            .find({
            uploadedBy: req.params.id,
        })
            .select("_id  uploadedBy, name url size createdAt")
            .populate({
            path: "uploadedBy",
            select: "_id username lastName firstName",
        })
            .skip(skip)
            .sort("-createdAt");
        if (!userNotes) {
            return res.status(404).send("not found");
        }
        return res.status(200).json({ notes: userNotes });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUserNotes = getUserNotes;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(req.query.page) || 1;
        const subject = ((_a = req.query.subject) === null || _a === void 0 ? void 0 : _a.toString()) || null;
        console.log(subject);
        const result = notesmodel_1.default
            .find(subject ? { subject } : {})
            .select(" _id uploadedBy  name url size createdAt")
            .skip((Number(page) - 1) * 30)
            .limit(30)
            .populate({
            path: "uploadedBy",
            select: "_id username lastName firstName ",
        })
            .sort("-createdAt");
        const notes = yield result;
        return res.status(200).json({ notes });
    }
    catch (err) {
        return res.status(400).json(err);
    }
});
exports.getNotes = getNotes;
const findNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body.input;
        const note = yield notesmodel_1.default.find({
            $or: [{ name: { $regex: input } }, { subject: { $regex: input } }],
        });
        if (!note)
            res.status(404).send("not found");
        return res.status(200).json(note);
    }
    catch (err) {
        console.log(err);
    }
});
exports.findNote = findNote;
const uploadNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const file = req.file;
        console.log(file);
        const uri = (0, dataUri_1.default)(file);
        const uploaded = yield cloudinary_1.default.v2.uploader.upload(uri.content);
        console.log(uploaded.secure_url);
        const newFile = yield notesmodel_1.default.create({
            name: req.body.name,
            uploadedBy: req.body.uploadedBy,
            size: uploaded.bytes / (1024 * 1024),
            url: uploaded.secure_url,
            subject: (_b = req.body.subject) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
            totalrating: 0,
            ratingsMap: new Map(),
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
