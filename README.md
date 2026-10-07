# nodejs-api — Node.js / Express REST API

Lightweight, high-performance **RESTful backend** built with **Node.js**, **Express**, and **MySQL**. Designed to provide **identical API endpoints** and data format as the ASP.NET Core version — enabling seamless backend switching in the frontend without any code changes.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| **Full CRUD Operations** | Create, Read, Update, Delete records in MySQL |
| **Search Functionality** | Filter by name, message, or address via query parameter |
| **Dual-Backend Compatible** | Exact same routes & JSON responses as ASP.NET version |
| **CORS Enabled** | Ready for React frontend integration — no connection errors |
| **Promise-Based MySQL** | Uses `mysql2/promise` for clean async/await code |
| **Single Shared Database** | Works alongside ASP.NET — both backends read/write same data |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime — fast, event-driven execution |
| **Express.js** | Web framework — routing, middleware, request handling |
| **mysql2** | MySQL driver — promise API for async database operations |
| **CORS** | Cross-Origin Resource Sharing — allows React to connect |
| **REST Standard** | HTTP methods + JSON + status codes — industry convention |

---

## 📂 Project Structure

| File / Folder | Purpose |
|---|---|
| `server.js` | Main application — routes, database pool, startup logic |
| `package.json` | Project metadata & dependencies list |
| `.gitignore` | Excludes `node_modules/` — keeps repository clean |
| `README.md` | Complete documentation & setup guide |

---

## 🔌 API Endpoints

Base URL: `http://localhost:3001/api/Greetings`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/Greetings` | Get all records |
| `GET` | `/api/Greetings?search={term}` | Search — matches name, message, or address |
| `POST` | `/api/Greetings` | Create new record — send JSON body |
| `PUT` | `/api/Greetings/{id}` | Update existing record by ID |
| `DELETE` | `/api/Greetings/{id}` | Remove record by ID |

### Example — POST Request Body
```json
{
  "Name": "Muhsin",
  "Age": 42,
  "Address": "Sheffield, UK",
  "Message": "Building full-stack systems"
}
