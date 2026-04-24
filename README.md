# BFHL — Graph Hierarchy Processor

## 🚀 Overview

This project processes a list of directed edges and builds hierarchical tree structures from them.
It validates input, removes duplicates, detects cycles, and generates structured output via a REST API.

The system is divided into:

* **Backend (Node.js + Express)** → API logic and processing
* **Frontend (HTML + JS)** → UI for interacting with the API

---

## 🔗 Live Links

* 🌐 Frontend: https://bajaj-assignment-alpha.vercel.app/
* ⚙️ Backend API: https://bajaj-assignment-r3oc.onrender.com/

---

## 📁 Project Structure

```
bajaj-assignment/
│
├── backend/
│   ├── index.js
│   ├── graphProcessor.js
│   └── package.json
│
├── frontend/
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## ⚙️ Backend API

### Endpoint

```
POST /bfhl
```

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

---

### Response Format

```json
{
  "user_id": "your_id",
  "email_id": "your_email",
  "college_roll_number": "your_roll",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 0,
    "total_cycles": 0,
    "largest_tree_root": ""
  }
}
```

---

## 🧠 Features

* ✔ Input validation (format + self-loop detection)
* ✔ Duplicate edge detection
* ✔ Graph construction using adjacency list
* ✔ Cycle detection using DFS
* ✔ Connected component grouping
* ✔ Tree generation from root nodes
* ✔ Depth calculation for hierarchies
* ✔ Summary generation

---

## 🖥️ Run Locally

### 1. Backend

```bash
cd backend
npm install
node index.js
```

Server runs on:

```
http://localhost:3000
```

---

### 2. Frontend

Open:

```
frontend/index.html
```

---

## 🧪 Example Input

```
A->B, A->C, B->D, C->E, E->F
X->Y, Y->Z, Z->X
P->Q, Q->R
G->H, G->I
hello, 1->2, A->
```

---

## ⚠️ Notes

* Backend accepts only **POST requests**
* API expects **JSON input**
* Frontend must use deployed backend URL (not localhost)
* Free hosting (Render) may have initial delay due to cold start

---

## 📌 Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** HTML, CSS, JavaScript
* **Deployment:** Render (backend), Vercel (frontend)

---

## ✅ Status

✔ Fully functional
✔ Deployed and tested
✔ Ready for evaluation

---
