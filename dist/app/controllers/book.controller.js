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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                error
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error
            });
        }
    }
}));
exports.booksRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;
        const limitNumber = Number(limit) || 10;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === 'desc' ? -1 : 1 })
            .limit(limitNumber);
        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        });
    }
}));
exports.booksRoutes.get('/:bookId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield book_model_1.Book.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        book.updateAvailability();
        yield book.save();
        res.json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        });
    }
})));
exports.booksRoutes.put('/:bookId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const updatedData = req.body;
        const book = yield book_model_1.Book.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        book.updateAvailability();
        yield book.save();
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                error
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error
            });
        }
    }
})));
exports.booksRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        yield book_model_1.Book.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        });
    }
}));
