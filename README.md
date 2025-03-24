# Real-time Global Chat

![WebSocket](https://img.shields.io/badge/websocket-%2300C7B7.svg?style=for-the-badge&logo=websocket&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%2300C7B7.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## About This Project

This project is a real-time global chat application built with Nginx, Vite, TypeScripte, Websocket, and Docker for containerization.

### Features

- **Real-Time Communication**: Enables users to chat in real-time using WebSocket.
- **Hot Reload for Development**: Automatically reloads the frontend and backend during development.
- **Integrated Logging**: Provides logging for both frontend and backend to simplify debugging.
- **Multi-Environment Docker Support**: Separate Docker configurations for development and production.
- **Makefile Commands**: Simplifies Docker-related tasks with predefined commands.
- **Optimized Docker Builds**: Faster build times with optimized Dockerfiles.
- **Scalable Architecture**: Designed to handle multiple users with ease.

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/nginx-vite-ts-express.git
   cd nginx-vite-ts-express
   ```

2. Install dependencies:
   ```sh
   cd frontend && npm install
   ```
   ```sh
   cd backend && npm install
   ```

### Development

1. Start vite by runnning the following command inside `/frontend` :

   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Start the websocket server by runnning the following command inside `/backend` :

   ```sh
   npm run dev
   # or
   yarn dev

   ```

3. Open your browser and navigate to `http://localhost:5173` to view the chat application.

## Docker 🐳

If you prefer docker for development or production with nginx, follow these steps for setting up docker.

### Development

1. Build the Docker images:

   ```sh
   docker compose build
   ```

   This command uses `docker-compose.override.yml` to build development images of `nginx`, `app`, and `websocket` with hot reload. You can change the image configuration inside `Dockerfile.dev`.

2. Run the images in containers.

   ```sh
   docker compose up
   ```

   **ALTERNATIVE:**,
   You can run `make build-dev` to build all dev images. Or `make up-dev` to start the dev images to containers. You can run `make help` to view all makefile commands.

### Production

1. Build the Docker images:

   ```sh
   docker-compose build -f docker-compose.yml
   ```

   This uses the default `docker-compose.yml` with production environemnt. Unlike dev, its `Dockerfile` builds the frontend which then served by nginx.

2. Run the production images in containers.
   ```sh
   docker compose -f docker-compose.yml up
   ```
   **ALTENATIVE:**,
   You can run `make build-prod` to build or `make up-prod` to start your production containers. You can run `make help` to view all makefile commands.

## Project Structure 📁

- `frontend/`: Source code for the frontend (Vite/TypeScript).
- `backend/`: Source code for the backend (websocket server).
- `nginx/`: Nginx configuration files.
- `Dockerfile`: Docker configuration for containerized production deployment.
- `Dockerfile.dev`: Docker configuration for containerized development.
- `docker-compose.yml`: Docker Compose configuration for production.
- `docker-compose.override.yml`: Docker Compose configuration for development.
- `Makefile`: Makefile commands for building and running Docker containers.

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
