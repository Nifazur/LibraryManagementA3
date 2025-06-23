"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
require('dotenv').config();
let server;
const PORT = 3400;
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tebz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    app_1.default.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.error('Connection error', err));
