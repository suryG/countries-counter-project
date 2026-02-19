# Countries Counter Project

This project is a simple full-stack web application that tracks website visits by country code and displays the results in real time.
It was built as a backend-focused exercise with a minimal frontend, demonstrating REST API design, Redis usage, and deployment.

The live version of the project is available here:
[https://countries-counter-project.onrender.com/](https://countries-counter-project.onrender.com/)

## Project Overview

The application exposes an API that allows counting visits per country using a two-letter country code (for example: `us`, `il`, `fr`).
Each visit updates a counter stored in Redis.
The frontend fetches the aggregated statistics and displays them dynamically, including a visual chart.

The backend is implemented with Node.js and Express, while Redis is used as an in-memory data store for fast counters.
The frontend is served as static files from the backend.

## Features

* REST API for updating country visit statistics
* Redis-based counter storage
* Endpoint to retrieve aggregated statistics for all countries
* Simple frontend that fetches data from the backend
* Dynamic updates without page reload
* Deployed backend on Render

## API Endpoints

POST `/stats/:country`
Increments the visit counter for the given country code.
The country code must be exactly two letters.

GET `/stats`
Returns a JSON object containing all country counters.

Example response:

```json
{
  "us": 12,
  "il": 7,
  "fr": 3
}
```

## Project Structure

* `server.js` – Main Express server
* `public/` – Static frontend files (including `index.html`)
* `src/redisClient.js` – Redis connection logic
* `package.json` – Project configuration and dependencies

## Running the Project Locally

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```
3. Make sure Redis is running locally
4. Start the server:

   ```
   node server.js
   ```
5. Open your browser at:

   ```
   http://localhost:3000
   ```

## Deployment Notes

The backend is deployed on Render.
Static files are served using Express from the `public` directory.
The application is configured to use the `PORT` environment variable provided by Render.

## Purpose

This project was created to demonstrate backend development skills, including API design, Redis integration, and deployment.
It focuses on clarity, simplicity, and correct handling of production vs. local environments.

---