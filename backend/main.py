from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import sqlite3
from uuid import uuid4

# FastAPI setup

app = FastAPI()
v1 = APIRouter(prefix="/api/v1")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite setup

DB_PATH = Path(__file__).resolve().parent / "todos.db"

def _get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def _ensure_db() -> None:
    with _get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                is_completed INTEGER NOT NULL
            )
            """
        )

_ensure_db()

# data modelling

class TodoModel(BaseModel):
    name: str
    description: str
    isCompleted: bool

def _row_to_todo(row: sqlite3.Row | None) -> TodoModel:
    if row is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoModel(
        name=row["name"],
        description=row["description"],
        isCompleted=bool(row["is_completed"]),
    )

# REST endpoints

@v1.get("/ping")
def ping() -> dict[str, str]:
    return {"message": "pong"}

@v1.get("/todos")
def getAllTodos() -> list[str]:
    with _get_connection() as connection:
        cursor = connection.execute("SELECT id FROM todos")
        return [row["id"] for row in cursor.fetchall()]

@v1.get("/todo/{id}")
def getTodo(id: str) -> TodoModel:
    with _get_connection() as connection:
        row = connection.execute(
            "SELECT name, description, is_completed FROM todos WHERE id = ?",
            (id,),
        ).fetchone()

    return _row_to_todo(row)

@v1.put("/todo")
def createTodo(todo: TodoModel) -> str:
    id = str(uuid4())

    with _get_connection() as connection:
        connection.execute(
            "INSERT INTO todos (id, name, description, is_completed) VALUES (?, ?, ?, ?)",
            (id, todo.name, todo.description, int(todo.isCompleted)),
        )

    return id

@v1.patch("/todo/{id}")
def updateTodo(id: str, todo: TodoModel) -> TodoModel:
    with _get_connection() as connection:
        cursor = connection.execute(
            "UPDATE todos SET name = ?, description = ?, is_completed = ? WHERE id = ?",
            (todo.name, todo.description, int(todo.isCompleted), id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Todo not found")

        row = connection.execute(
            "SELECT name, description, is_completed FROM todos WHERE id = ?",
            (id,),
        ).fetchone()

    return _row_to_todo(row)

@v1.delete("/todo/{id}")
def deleteTodo(id: str) -> bool:
    with _get_connection() as connection:
        cursor = connection.execute("DELETE FROM todos WHERE id = ?", (id,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Todo not found")

    return True

# FastAPI path prefix inclusion

app.include_router(v1)
