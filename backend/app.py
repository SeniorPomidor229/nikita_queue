from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from typing import List
import sqlite3

app = FastAPI()

security = HTTPBasic()

# Модель данных для очереди
class Queue(BaseModel):
    id: str
    name: str
    max_capacity: int
    is_public: bool

# Модель данных для записи в очередь
class QueueItem(BaseModel):
    id: str
    queue_id: str
    user_name: str

# Модель данных для аутентификации
class User(BaseModel):
    username: str
    password: str

# Создание таблицы в базе данных
def create_table():
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS queues
                 (id TEXT PRIMARY KEY,
                  name TEXT,
                  max_capacity INTEGER,
                  is_public INTEGER)''')
    conn.commit()
    c.execute('''CREATE TABLE IF NOT EXISTS queue_items
                 (id TEXT PRIMARY KEY,
                  queue_id TEXT,
                  user_name TEXT)''')
    conn.commit()
    c.execute('''CREATE TABLE IF NOT EXISTS admins
                 (username TEXT PRIMARY KEY,
                  password TEXT)''')
    conn.commit()
    conn.close()

# Аутентификация пользователя
def authenticate_user(credentials: HTTPBasicCredentials):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("SELECT password FROM admins WHERE username=?", (credentials.username,))
    row = c.fetchone()
    conn.close()
    if row is None or credentials.password != row[0]:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    return credentials.username

# Создание новой очереди
@app.post("/queues")
def create_queue(queue: Queue, username: str = Depends(authenticate_user)):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("INSERT INTO queues (id, name, max_capacity, is_public) VALUES (?, ?, ?, ?)",
              (queue.id, queue.name, queue.max_capacity, queue.is_public))
    conn.commit()
    conn.close()
    return queue

# Получение списка всех очередей
@app.get("/queues", response_model=List[Queue])
def get_queues():
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("SELECT id, name, max_capacity, is_public FROM queues")
    rows = c.fetchall()
    queues = [Queue(id=row[0], name=row[1], max_capacity=row[2], is_public=bool(row[3])) for row in rows]
    conn.close()
    return queues

# Получение информации о конкретной очереди
@app.get("/queues/{queue_id}", response_model=Queue)
def get_queue(queue_id: str):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("SELECT id, name, max_capacity, is_public FROM queues WHERE id=?", (queue_id,))
    row = c.fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Queue not found")
    queue = Queue(id=row[0], name=row[1], max_capacity=row[2], is_public=bool(row[3]))
    conn.close()
    return queue

# Обновление информации о конкретной очереди
@app.put("/queues/{queue_id}")
def update_queue(queue_id: str, queue: Queue, username: str = Depends(authenticate_user)):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("UPDATE queues SET name=?, max_capacity=?, is_public=? WHERE id=?",
              (queue.name, queue.max_capacity, queue.is_public, queue_id))
    conn.commit()
    conn.close()
    return queue

# Удаление очереди
@app.delete("/queues/{queue_id}")
def delete_queue(queue_id: str, username: str = Depends(authenticate_user)):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("DELETE FROM queues WHERE id=?", (queue_id,))
    conn.commit()
    conn.close()
    return {"message": "Queue deleted successfully."}

# Добавление записи в очередь
@app.post("/queues/{queue_id}/items")
def add_queue_item(queue_id: str, item: QueueItem):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    # Проверяем, существует ли указанная очередь
    c.execute("SELECT id FROM queues WHERE id=?", (queue_id,))
    row = c.fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Queue not found")
    # Проверяем, не превышено ли максимальное количество записей в очереди
    c.execute("SELECT COUNT(*) FROM queue_items WHERE queue_id=?", (queue_id,))
    count = c.fetchone()[0]
    c.execute("SELECT max_capacity FROM queues WHERE id=?", (queue_id,))
    max_capacity = c.fetchone()[0]
    if count >= max_capacity:
        raise HTTPException(status_code=400, detail="Queue is full")
    # Добавляем запись в очередь
    c.execute("INSERT INTO queue_items (id, queue_id, user_name) VALUES (?, ?, ?)",
              (item.id, queue_id, item.user_name))
    conn.commit()
    conn.close()
    return item

# Получение списка записей в очереди
@app.get("/queues/{queue_id}/items", response_model=List[QueueItem])
def get_queue_items(queue_id: str):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("SELECT id, queue_id, user_name FROM queue_items WHERE queue_id=?", (queue_id,))
    rows = c.fetchall()
    items = [QueueItem(id=row[0], queue_id=row[1], user_name=row[2]) for row in rows]
    conn.close()
    return items

# Удаление записи из очереди
@app.delete("/queues/{queue_id}/items/{item_id}")
def delete_queue_item(queue_id: str, item_id: str):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("DELETE FROM queue_items WHERE queue_id=? AND id=?", (queue_id, item_id))
    conn.commit()
    conn.close()
    return {"message": "Item deleted successfully."}

# Создание таблицы и пользователей перед запуском приложения
create_table()

# Создание администратора (для примера)
def create_admin(username: str, password: str):
    conn = sqlite3.connect('queue.db')
    c = conn.cursor()
    c.execute("INSERT INTO admins (username, password) VALUES (?, ?)",
              (username, password))
    conn.commit()
    conn.close()

create_admin("admin", "admin")
