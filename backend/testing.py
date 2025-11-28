from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

class Item(BaseModel):
    name: str | None = None
    description: str | None = None
    date: float | None = None


items = {
    "TestName":{
        "name":"TestName",
        "description":"This is a test item",
        "date":29.01,
    },
    "TestDesc":{
        "name":"TestName",
        "description":"This is a test item",
        "date":29.01,
    },
    # "TestDesc":{"description":"TestDesc"},
    # "TestDate":{"Date":"29.01.26"}, 

}


@app.get("/items", response_model=list[Item])
async def read_items():
    return list(items.values())


@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]


@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    update_item_encoded = jsonable_encoder(item)
    items[item_id] = update_item_encoded
    return update_item_encoded


