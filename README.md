# Bookmarks API

A RESTful API for managing bookmarks built with NestJS, featuring user authentication and bookmark management.

## Features

- User authentication (signup/signin) with JWT
- User profile management
- CRUD operations for bookmarks
- Swagger API documentation
- Docker containerization with PostgreSQL

## Tech Stack

- NestJS
- PostgreSQL
- Docker
- Prisma ORM
- JWT Authentication
- Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Database Setup

Start the PostgreSQL database using Docker:

```bash
# Development database
npm run db:dev:up

#Test database
npm run db:test:up
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### API Documentation

Access the Swagger documentation at /api when the server is running.

## Main Endpoints

### Auth

- POST /auth/signup - Create new user account
- POST /auth/signin - Authenticate user

### Users

- GET /users/me - Get current user profile
- PATCH /users - Update user details

### Bookmarks

- GET /bookmarks - List all bookmarks
- GET /bookmarks/:id - Get specific bookmark
- POST /bookmarks - Create new bookmark
- PATCH /bookmarks/:id - Update bookmark
- DELETE /bookmarks/:id - Delete bookmark

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.