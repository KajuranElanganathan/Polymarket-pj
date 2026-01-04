from db import Base, engine
from sqlalchemy import inspect

# This will add new columns without dropping existing ones
Base.metadata.create_all(bind=engine)