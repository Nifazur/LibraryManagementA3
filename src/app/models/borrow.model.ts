import {Schema, model} from 'mongoose'
import { IBorrow } from '../interfaces/borrow.interface'
import { Book } from './book.model'


const borrowSchema = new Schema<IBorrow>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

borrowSchema.post<IBorrow>('save', async function () {
    const book = await Book.findById(this.book);
    if(book) {
        book.copies -= this.quantity;
        book.updateAvailability();
        await book.save();
    }
})


export const Borrow = model<IBorrow>("Borrow", borrowSchema)