# Personal Blog API  💼

Welcome to the Personal Blog API repository! This API serves as the backend for a simple blogging platform, providing authentication, post management, and tagging functionalities.

## Installation 🛠️

1. Clone the repository:
   ```bash
   git clone git@github.com:jacodoisdois/personal-blog-api.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Endpoints 📡

### Authentication 🔒

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in with existing credentials.

### Posts 📄

- `POST /posts`: Create a new post.
- `GET /posts`: Get all posts.
- `GET /posts/:id`: Get a specific post by ID.
- `PUT /posts/:id`: Update a post by ID.
- `DELETE /posts/:id`: Delete a post by ID.

## Technologies Used 💻

- Express.js
- TypeScript
- TypeORM
- JSON Web Tokens (JWT)
- MySQL
- Inversify

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## References

[Build cleaner backends in Typescript](https://www.youtube.com/watch?v=XU0w62XQjpA&list=PLkyPUqu7ThxYMATLWT2R5iLOj7jCOtHBH)
