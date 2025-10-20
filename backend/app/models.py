"""Pydantic models untuk Team Task Tracker backend."""

from typing import Optional
# import datetime
from pydantic import BaseModel


class Task(BaseModel):
    """Model untuk representasi satu task di database."""
    id: str
    title: str
    description: Optional[str] = ""
    assignee: Optional[str] = ""
    created_at: Optional[str] = None
    start_date: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "Belum Dimulai"

class TaskCreate(BaseModel):
    """Model untuk membuat task baru."""
    title: str
    description: Optional[str] = ""
    assignee: Optional[str] = ""
    start_date: Optional[str] = None
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    """Model untuk memperbarui task yang sudah ada."""
    title: Optional[str]
    description: Optional[str]
    assignee: Optional[str]
    status: Optional[str]
    start_date: Optional[str]
    due_date: Optional[str]

class DashboardData(BaseModel):
    """Model untuk data dashboard (statistik)."""
    total_tasks: int
    by_status: dict
    by_assignee: dict
