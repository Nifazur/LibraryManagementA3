import express, { Application, Request, Response } from 'express';
import { booksRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';


const app: Application = express();



app.use(express.json());




app.use("/api/books", booksRoutes)
app.use("/api/borrow", borrowRoutes)

app.get('/api', (req: Request, res: Response) => {
    res.send('Welcome to LibraryManagement App api');
});
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to LibraryManagement App');
});

export default app;