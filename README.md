# Library Management System

API for managing a library's book inventory and borrowing system built with Node.js, Express, TypeScript, MongoDB And Mongoose .

## Features

- **Book Management**: Create, read, update, and delete books
- **Inventory Tracking**: Automatic availability updates based on copy counts
- **Borrowing System**: Track borrowed books with quantities and due dates
- **Filtering & Sorting**: Filter books by genre and sort results
- **Borrowing Analytics**: Get summary of borrowed books with aggregated data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Environment**: dotenv for configuration

## Project Structure

```
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── server.ts                       # Server startup and database connection
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── book.controller.ts      # Book CRUD operations
│   │   │   └── borrow.controller.ts    # Borrowing operations
│   │   ├── models/
│   │   │   ├── book.model.ts           # Book schema and model
│   │   │   └── borrow.model.ts         # Borrow schema and model
│   │   └── interfaces/
│   │       ├── book.interface.ts       # Book TS interfaces
│   │       └── borrow.interface.ts     # Borrow TS interfaces
```

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd library-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on port 3400.

## API Endpoints

### Books

#### Create a Book
```http
POST /api/books

{
  "title": "Book title",
  "author": "Author Name",
  "genre": "Name of the genre",
  "isbn": "978-0-7432-7356-5",
  "description": "description",
  "copies": 4
  "available": true or false
}

Response:
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### Get All Books
```http
GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=10
```

Query Parameters:
- `filter`: Filter by genre (optional)
- `sortBy`: Field to sort by (default: `createdAt`)
- `sort`: Sort order - `asc` or `desc` (default: `desc`)
- `limit`: Number of results (default: `10`)

#### Get Book by ID
```http
GET /api/books/:bookId

Response:

{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### Update a Book
```http
PUT /api/books/:bookId
Content-Type: application/json

{
  "copies": 3,
}

Response:
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 3,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}

```

#### Delete a Book
```http
DELETE /api/books/:bookId

Response:
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}

```

### Borrowing

#### Borrow a Book
```http
POST /api/borrow
Content-Type: application/json

{
  "book": "60f1b2c3d4e5f6789abcdef0",
  "quantity": 2,
  "dueDate": "2024-12-31T23:59:59.000Z"
}

Response:
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "60f1b2c3d4e5f6789abcdef0",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

#### Get Borrowing Summary
```http
GET /api/borrow

Response:
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

Returns aggregated data showing total quantities borrowed for each book.

## Data Models

### Book Schema
```typescript
{
  title: string;           // Required
  author: string;          // Required
  genre: Genre;           // Required (enum) enum Genre { FICTION = 'FICTION', ....}
  isbn: string;           // Required, unique
  description?: string;   // Optional
  copies: number;         // Required, min: 0
  available: boolean;     // Auto-calculated
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```


### Borrow Schema
```typescript
{
  book: ObjectId;         // Reference to Book
  quantity: number;       // Required, min: 1
  dueDate: Date;         // Required
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

## Key Features

### Automatic Availability Management
- Books are automatically marked as unavailable when copies reach 0
- Borrowing a book automatically decreases the copy count
- Availability status is updated before saving

### Input Validation
- Required fields validation
- Data type validation
- Minimum value constraints

### Error Handling
- Comprehensive error responses
- Validation error messages
- 404 handling for non-existent resources
- Server error handling

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": { /* error details */ }
}
```
