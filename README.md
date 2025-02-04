# CelePlanner

A web application designed to manage theater schedules, integrating with Google Calendar and providing a robust backend for event management.

## Features
- Synchronize events with Google Calendar, including detection of changes, additions, and deletions.
- Manage events with detailed attributes, such as:
  - Show time.
  - Arrival time for technicians and workers (facchini).
  - Number of workers for setup and teardown.
  - Technicians assigned to setup, show, and teardown with specific roles (stagehand, electrician, sound engineer).
  - Notes for additional details.
- Backend developed with Node.js and Express.js.
- Dockerized environment for easy deployment.
- Multi-access capability with data persistence using PostgreSQL.

---

## Project Requirementss

### General Requirements
1. Use of Git for version control.
2. Code and comments entirely in English.
3. Open source project, accessible worldwide.
4. Future-proof architecture for backend scalability.
5. Docker for deployment.

### Backend Requirements
1. RESTful API developed in Node.js and Express.js.
2. Integration with Google Calendar:
   - Regular synchronization to fetch new events, detect modifications, and handle deletions.
   - Support for events not present in Google Calendar (local-only).
3. Database integration for event persistence (PostgreSQL):
   - Event attributes to store:
     - **Show time**.
     - **Arrival time for workers and technicians**.
     - **Number of workers for setup and teardown**.
     - **Technicians assigned to setup, show, and teardown**, with roles (stagehand, electrician, sound engineer).
     - **Additional notes**.

### Frontend Requirements
1. Developed in React.
2. User-friendly interface with:
   - Monthly calendar view.
   - Printable schedules.
   - Clear visualization of events.
3. Communication with the backend via RESTful APIs.

---

### Environment Variables
Create a `.env` file in the root directory with the following structure:
```env
# Database configuration
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=celedb

# Backend configuration
NODE_ENV=development
PORT=3001
