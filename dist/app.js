"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./route/router"));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_1.default.set("strictQuery", false);
const start = () => {
    try {
        mongoose_1.default
            .connect("mongodb+srv://nischalgautam7200:720058726Nn1@cluster0.4qkuktl.mongodb.net/?retryWrites=true&w=majority")
            .then(() => app.listen(5000, () => console.log("connected to the database & listening to port")));
    }
    catch (err) {
        console.log(err);
    }
};
start();
app.use("/api", router_1.default);
