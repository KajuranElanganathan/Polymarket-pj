from db import Base, engine
from sqlalchemy import inspect

Base.metadata.create_all(bind=engine)