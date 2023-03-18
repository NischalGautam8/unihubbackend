"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const router_1 = __importDefault(require("./route/router"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
mongoose_1.default.set("strictQuery", false);
const http_1 = __importDefault(require("http"));
const httpserver = http_1.default.createServer(app);
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(httpserver, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("joined room ", data);
    });
    socket.on("send_message", (data) => {
        console.log(data);
        socket.emit("receive_message", data);
    });
});
app.use("/api", router_1.default);
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
app.get("/auth/callback", passport_1.default.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
}), function (req, res) {
    res.redirect("/");
});
const start = () => {
    try {
        mongoose_1.default
            .connect("mongodb+srv://nischalgautam7200:720058726Nn1@cluster0.4qkuktl.mongodb.net/?retryWrites=true&w=majority")
            .then(() => httpserver.listen(5000, () => console.log("connected to the database & listening to port")));
    }
    catch (err) {
        console.log(err);
    }
};
start();
