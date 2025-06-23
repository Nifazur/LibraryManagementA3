import express, { Request, Response } from "express";
import { RequestHandler } from 'express';
import { Book } from "../models/book.model";


export const booksRoutes = express.Router()

booksRoutes.post('/', async(req: Request, res: Response) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                error
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error
            });
        }
    }
})


booksRoutes.get('/', async(req: Request, res: Response) => {
    try {
        const {filter, sortBy = 'createdAt', sort = 'desc', limit = '10'} = req.query;
        const limitNumber = Number(limit) || 10;
        const query: any = {}
        if(filter){
            query.genre = filter
        }
        const books = await Book.find(query)
            .sort({ [sortBy as string]: sort === 'desc' ? -1 : 1 })
            .limit(limitNumber);

        res.json({
        success: true,
        message: 'Books retrieved successfully',
        data: books,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        })
    }
})
booksRoutes.get('/:bookId', (async(req, res) => {

    try {
        const id = req.params.bookId
        const book = await Book.findById(id);
        if(!book)
        {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        book.updateAvailability();
        await book.save();
        res.json({
        success: true,
        message: 'Book retrieved successfully',
        data: book
        })
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        })
    }
}) as RequestHandler
)
booksRoutes.put('/:bookId', (async(req, res) => {
    try {
        const id = req.params.bookId
        const updatedData = req.body
        const book = await Book.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true})
        if(!book)
        {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        book.updateAvailability()
        await book.save()
        res.json({ 
            success: true, 
            message: 'Book updated successfully', 
            data: book 
        })
        
        
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                error
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error
            });
        }
    }
}) as RequestHandler
)
booksRoutes.delete('/:bookId', async(req: Request, res: Response) => {
    try {
        const id = req.params.bookId
        await Book.findByIdAndDelete(id)
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        })
    }
})
