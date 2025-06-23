import express, { Request, Response, RequestHandler } from 'express';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';

export const borrowRoutes = express.Router()


borrowRoutes.post( '/' , (async (req, res) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        const book = await Book.findById(bookId);
        if (!book)
        { 
            return res.status(404).json(
            { 
                success: false, 
                message: 'Book not found' 
            })
        } 
        if (book.copies < quantity)
        {
            return res.status(400).json(
            { 
                success: false,
                message: 'Not enough copies available'
            })
        }

        const borrow = await Borrow.create({ book: bookId, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrow,
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


borrowRoutes.get( '/' , async (req: Request, res: Response) => {
    try {
        const summary = await Borrow.aggregate([
        {
            $group: 
            {
                _id: '$book',
                totalQuantity: { $sum: '$quantity' },
            },
        },
        {
            $lookup: 
            {
                from: 'books',
                localField: '_id',
                foreignField: '_id',
                as: 'bookDetails',
            },
        },
        { $unwind: '$bookDetails' },
        {
            $project: 
            {
                _id: 0,
                book: {
                    title: '$bookDetails.title',
                    isbn: '$bookDetails.isbn',
                },
                totalQuantity: 1,
            },
        },
        ]);

        res.json(
        { 
            success: true, 
            message: 'Borrowed books summary retrieved successfully', 
            data: summary 
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }

})