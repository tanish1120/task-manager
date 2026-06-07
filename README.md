# Task Manager

## Project Title & Brief Description

The application allows users to create, view, update, complete, search, filter, and delete tasks. Tasks can optionally include a description and due date. The application also highlights overdue tasks, provides task statistics, and persists data using a local JSON file. The project is built using Next.js App Router, JavaScript, Tailwind CSS, and shadcn/ui.

---

## Live Demo Links

**Live Application:**
https://taskmanager.tanish.space

**GitHub Repository:**
https://github.com/tanish1120/task-manager

---

## Tech Stack

### Frontend

* **Next.js 15 (App Router)** – Full-stack React framework for UI and API routes.
* **JavaScript** – Primary programming language.
* **Tailwind CSS** – Utility-first styling framework.
* **shadcn/ui** – Reusable UI component library.
* **Lucide React** – Icon library.

### Backend

* **Next.js API Routes** – REST API implementation.
* **Node.js File System (fs/promises)** – Reading and writing task data.

### Storage

* **JSON File Persistence** – Tasks are stored in a local JSON file (`data/tasks.json`) and persist across local server restarts.

### Deployment Note

Task persistence is implemented using a local JSON file (`data/tasks.json`).

The application fully supports persistence in a local development environment, where tasks are stored and retained across server restarts.

When deployed on Vercel, file-system writes are ephemeral due to the serverless execution environment. As a result, newly created or updated tasks may not persist between deployments or function invocations.

For a production-ready deployment, I would replace JSON file storage with a persistent database solution such as SQLite, PostgreSQL, or MongoDB.

---

## Features

### Core Features

* Create new tasks
* Edit existing tasks
* Delete tasks with confirmation
* Mark tasks as complete/incomplete
* View all tasks
* Filter tasks (All, Active, Completed)
* Search tasks by title

### Additional Features

* Active vs Completed task counters
* Overdue task detection
* Empty state UI
* Responsive design
* JSON file persistence

---

## How to Run Locally

### Prerequisites

* Node.js (v18 or higher)
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/task-manager.git

cd task-manager
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## API Documentation

### Get All Tasks

**Method**

```http
GET /api/tasks
```

**Response**

```json
[
  {
    "id": "123",
    "title": "Finish assignment",
    "description": "Complete README",
    "dueDate": "2026-06-10",
    "completed": false,
    "createdAt": 1749550000000
  }
]
```

---

### Create Task

**Method**

```http
POST /api/tasks
```

**Request Body**

```json
{
  "title": "Finish assignment",
  "description": "Complete README",
  "dueDate": "2026-06-10"
}
```

**Response**

```json
{
  "message": "Task created successfully",
  "task": {}
}
```

---

### Update Task

**Method**

```http
PUT /api/tasks/:id
```

**Request Body**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-06-12"
}
```

**Response**

```json
{
  "message": "Task updated successfully",
  "task": {}
}
```

---

### Toggle Task Completion

**Method**

```http
PATCH /api/tasks/:id/toggle
```

**Response**

```json
{
  "message": "Task status updated",
  "task": {}
}
```

---

### Delete Task

**Method**

```http
DELETE /api/tasks/:id
```

**Response**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Project Structure

```txt
task-manager/
│
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.js
│   │       ├── [id]/
│   │       │   └── route.js
│   │       └── [id]/toggle/
│   │           └── route.js
│   │
│   ├── layout.js
│   ├── page.jsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   │   ├── alert-dialog.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── checkbox.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── skeleton.jsx
│   │   ├── tabs.jsx
│   │   └── textarea.jsx
│   │
│   └── task-skeleton.jsx
│
├── data/
│   └── tasks.json
│
├── lib/
│   ├── taskStorage.js
│   └── utils.js
│
├── public/
│
├── README.md
├── package.json
└── package-lock.json
```

### Folder Overview

* **app/** – Next.js pages and API routes.
* **components/** – Reusable UI components.
* **lib/** – Utility functions and task persistence logic.
* **data/** – JSON-based task storage.
* **public/** – Static assets.

---

## Design Decisions

### Why Next.js?

Using Next.js allowed both frontend and backend functionality to live within a single codebase, simplifying development and deployment.

### Why JSON Storage?

The assessment requirements allowed lightweight persistence solutions. A JSON file provided a simple approach without requiring database setup while still demonstrating data persistence.

### Why shadcn/ui?

shadcn/ui provides accessible, reusable, and customizable UI components while maintaining full control over styling.

---

## Next Steps

Given additional time, I would implement:

* Drag-and-drop task reordering
* SQLite or PostgreSQL database integration
* User authentication
* Task priority levels
* Task categories/tags
* Unit and integration tests
* Pagination for large task lists
* Dark mode support
* Activity history and audit tracking

---

## Future Improvements

* Server-side validation using Zod
* Optimistic UI updates
* React Query for data fetching and caching
* Improved accessibility testing
* Docker containerization
* CI/CD pipeline integration

---

## Author

**Tanish Rathore**
Full Stack Developer

🌐 Portfolio: https://tanish.space

Thank you for reviewing my submission.
