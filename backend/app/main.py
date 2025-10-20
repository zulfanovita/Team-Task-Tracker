"""Main FastAPI app for Team Task Tracker"""
from uuid import uuid4
import datetime
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.auth import simple_auth
from app.storage import Storage
from app.models import TaskCreate, TaskUpdate

app = FastAPI()
storage = Storage(path="./db.json")

# ======================
# ⚙️ Konfigurasi CORS
# ======================
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# 🔐 LOGIN ENDPOINT
# ======================
class LoginRequest(BaseModel):
    password: str

@app.post("/login")
def login(payload: LoginRequest):
    """Login sederhana untuk Project Manager"""
    if simple_auth(payload.password):
        return {"ok": True, "token": "project-manager-token"}
    raise HTTPException(status_code=401, detail="Invalid password")

# ======================
# 🧱 TASK CRUD
# ======================
@app.post("/tasks")
def create_task(payload: TaskCreate):
    """Create a new task"""
    task = payload.dict()
    task_id = str(uuid4())
    now = datetime.datetime.utcnow().isoformat()
    new = {
        "id": task_id,
        "title": task.get("title"),
        "description": task.get("description", ""),
        "assignee": task.get("assignee", ""),
        "created_at": now,
        "start_date": task.get("start_date"),
        "due_date": task.get("due_date"),
        "status": "Belum Dimulai",
    }
    storage.append("tasks", new)
    storage.append("logs", {
        "id": str(uuid4()),
        "task_id": task_id,
        "action": "created",
        "timestamp": now,
        "note": "Task dibuat"
    })
    return new

@app.get("/tasks")
def list_tasks():
    """Ambil semua task"""
    return storage.read("tasks")


@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    """Get a task by ID, including logs"""
    task = storage.find_by_id("tasks", task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    logs = [l for l in storage.read("logs") if l.get("task_id") == task_id]
    return {"task": task, "logs": logs}


@app.put("/tasks/{task_id}")
def update_task(task_id: str, payload: TaskUpdate):
    """Update a task by ID"""
    task = storage.find_by_id("tasks", task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    updated = {**task, **{k: v for k, v in payload.dict().items() if v is not None}}
    storage.update("tasks", task_id, updated)
    now = datetime.datetime.utcnow().isoformat()
    storage.append("logs", {
        "id": str(uuid4()),
        "task_id": task_id,
        "action": "updated",
        "timestamp": now,
        "note": f"Updated fields: {list(payload.dict().keys())}"
    })
    return updated

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    """Delete a task by ID"""
    found = storage.find_by_id("tasks", task_id)
    if not found:
        raise HTTPException(404, "Task not found")
    storage.delete("tasks", task_id)
    now = datetime.datetime.utcnow().isoformat()
    storage.append("logs", {
        "id": str(uuid4()),
        "task_id": task_id,
        "action": "deleted",
        "timestamp": now,
        "note": "Task dihapus"
    })
    return {"ok": True}

@app.get("/dashboard")
def dashboard():
    """Return dashboard summary (total tasks, by status, by assignee)"""
    tasks = storage.read("tasks")
    total = len(tasks)
    by_status = {}
    by_assignee = {}
    for t in tasks:
        s = t.get("status", "Belum Dimulai")
        by_status[s] = by_status.get(s, 0) + 1
        a = t.get("assignee", "(unassigned)")
        by_assignee[a] = by_assignee.get(a, 0) + 1
    return {"total_tasks": total, "by_status": by_status, "by_assignee": by_assignee}
