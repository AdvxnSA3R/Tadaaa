# Import FastAPI framework for building APIs
from fastapi import FastAPI
# Import helper to convert Pydantic models to JSON-compatible data
from fastapi.encoders import jsonable_encoder
# Import BaseModel from Pydantic for data validation and serialization
from pydantic import BaseModel

# Create a FastAPI application instance
app = FastAPI()


# Define a data model (schema) for items using Pydantic
class Item(BaseModel):
    # Optional string field for task name
    value: str | None = None


# In-memory "database" of items (dictionary)
items = {
    "foo": {"value": "Foo"},
    "bar": {"value": "Bar"},
    "baz": {"value": "Baz"},
}


# Endpoint: GET /items/{item_id}
# Retrieves an item by its ID from the dictionary
@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    # Return the item data (FastAPI automatically validates against Item model)
    return items[item_id]


# Endpoint: PUT /items/{item_id}
# Updates an existing item with new data provided in the request body
@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    # Convert Pydantic model to JSON-compatible dict
    update_item_encoded = jsonable_encoder(item)
    # Replace the old item with the new one in the dictionary
    items[item_id] = update_item_encoded
    # Return the updated item
    return update_item_encoded