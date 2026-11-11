# Student Information API

A RESTful API using Node.js, Express,
TypeScript, and Supabase PostgreSQL.

## Features

- GET all students
- GET student by ID
- POST new student
- PUT update student
- DELETE student

## Installation

pnpm install

## Run the project

pnpm dev

## API Endpoints
 
| Method | Endpoint | Description | Success Status |
| --- | --- | --- | --- |
| `GET` | `/students` | Retrieve all student records | `200 OK` |
| `GET` | `/students/:id` | Retrieve one student by ID | `200 OK` |
| `POST` | `/students` | Create a new student record | `201 Created` |
| `PUT` | `/students/:id` | Replace all editable fields of a student | `200 OK` |
| `DELETE` | `/students/:id` | Delete a student record by ID | `200 OK` |