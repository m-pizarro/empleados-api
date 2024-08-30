# Empleados API

Welcome to the Empleados API documentation.

## Tech

Tech Stack to use: Nest.js + TypeScript + MongoDB + Mongoose + Jest + supertest

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Docker Compose
- Node.js
- TypeScript

## Getting Started

1.  **Clone the Repository**

    Clone the Empelados API repository: `git clone https://github.com/m-pizarro/empleados-api.git`.

2.  **Environment Setup**

    Ensure you have a `.env` file at the root of the project with the necessary environment variables.

3.  **Docker Compose**

    It's highly recommended to use Docker Compose for running the application. This will ensure a consistent environment and easy setup.

4.  **Running with Docker Compose**

    Start all services with the following command:

    bashCopy code

    `docker-compose up -d`

    This will build and start all the necessary containers in detached mode.

5.  **Accessing the Application**

    - The API will be available at `http://localhost:3000`.
    - MongoDB can be accessed on `mongodb://mongodb:27017`.

## Running Without Docker

While Docker is recommended, you can run the application directly on your machine.

1.  Install Node.js dependencies:

    `yarn install`

2.  Start the application:

    `yarn dev`

    Ensure that you have the required databases and services running locally.

**Environment Setup**

Ensure you have a `.env` file at the root of the project with the necessary environment variables.

## Running the app

```bash
# development
$ yarn run dev

```

## Test

```bash
# unit tests
$ yarn run test

```

## Author

- Author - [Mariano Pizarro](http://www.linkedin.com/in/mariano-pizarro-70317932)
- GitHub - [http://github.com/m-pizarro](http://github.com/m-pizarro)

## License

Nest is [MIT licensed](LICENSE).
