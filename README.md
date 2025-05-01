# Task Manager

Task Manager is a Node.js-based application for managing tasks. It supports user authentication, role-based access control, and task management features. The app is built with TypeScript, Express, MongoDB, and Redis.

## Features

- User registration and login with JWT-based authentication.
- Role-based access control (Admin and User roles).
- CRUD operations for tasks.
- Redis caching for improved performance.
- Dockerized for easy deployment.

## Prerequisites

- Node.js and npm installed.
- Docker installed.
- MongoDB and Redis instances running locally or in the cloud.
- Free-tier account on a cloud provider (e.g., Render, Railway, or fly.io).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/task_manager.git
   cd task_manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-jwt-secret
   REDIS_URL=redis://localhost:6379
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Running Tests

To run the test suite, use the following command:
```bash
npm test
```

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Login and get a JWT token.

### Tasks
- **POST** `/api/task` - Create a new task (requires authentication).
- **GET** `/api/task` - Get all tasks (requires authentication).
- **GET** `/api/task/:id` - Get a specific task by ID (requires authentication).
- **PUT** `/api/task/:id` - Update a task by ID (requires authentication).
- **DELETE** `/api/task/:id` - Delete a task by ID (requires admin role).

## Deployment Steps

### Using Docker Locally
1. Build the Docker image:
   ```bash
   docker build -t task_manager .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 --env-file .env task_manager
   ```

### Deploying to a Cloud Provider
1. Choose a free-tier cloud provider (e.g., Render, Railway, or fly.io).
2. Follow the steps below for your chosen provider:

#### Render
- Create a new Web Service.
- Connect your GitHub repository.
- Add environment variables from your `.env` file.
- Set the build command to:
  ```bash
  docker build -t task_manager .
  ```
- Set the start command to:
  ```bash
  docker run -p 5000:5000 --env-file .env task_manager
  ```

#### Railway
- Create a new project.
- Deploy using the Dockerfile.
- Add environment variables from your `.env` file.

#### fly.io
- Install the Fly CLI:
  ```bash
  curl -L https://fly.io/install.sh | sh
  ```
- Initialize the app:
  ```bash
  fly launch
  ```
- Add environment variables using:
  ```bash
  fly secrets set PORT=5000 MONGO_URI=<your-mongo-uri> JWT_SECRET=<your-jwt-secret> REDIS_URL=<your-redis-url>
  ```
- Deploy the app:
  ```bash
  fly deploy
  ```

## Environment Variables

The application uses the following environment variables:

| Variable      | Description                          | Example                          |
|---------------|--------------------------------------|----------------------------------|
| `PORT`        | Port number for the server           | `5000`                          |
| `MONGO_URI`   | MongoDB connection string            | `mongodb://localhost:27017/db`  |
| `JWT_SECRET`  | Secret key for JWT authentication    | `your-secret-key`               |
| `REDIS_URL`   | Redis connection string              | `redis://localhost:6379`        |

## Project Structure

```
.env
.gitignore
DockerFile
package.json
README.md
tsconfig.json
src/
  app.ts
  index.ts
  config/
    db.ts
  controllers/
    auth.controller.ts
    task.controller.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
  models/
    Task.ts
    User.ts
  routes/
    auth.routes.ts
    task.routes.ts
  utils/
    redis.ts
test/
  auth.test.ts
  task.test.ts
types/
  express.d.ts
```

## Technologies Used

- **Node.js**: JavaScript runtime.
- **TypeScript**: Typed superset of JavaScript.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Redis**: In-memory data store for caching.
- **Docker**: Containerization platform.
- **Mocha & Chai**: Testing framework and assertion library.

## License

This project is licensed under the ISC License.