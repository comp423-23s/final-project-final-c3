from sqlalchemy import create_engine
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

engine = create_engine("sqlite+pysqlite:///:memory:", echo=True)

# use Core
metadata_obj = MetaData()

user_table = Table(
    "user_account",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(30)),
    Column("fullname", String)
)
print(repr(user_table.c.id))

address_table = Table(
    "address",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", ForeignKey('user_account.id'), nullable=False),
    Column("email_address", String, nullable=False),
)

metadata_obj.create_all(engine)


# use ORM
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "user_account"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    fullname: Mapped[str | None]

    addresses: Mapped[list["Address"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r})"
    
class Address(Base):   
    __tablename__ = "address"

    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str]
    user_id = mapped_column(ForeignKey("user_account.id"))

    user: Mapped[User] = relationship(back_populates="addresses")

    def __repr__(self) -> str:
        return f"Address(id={self.id!r}, email_address={self.email_address!r})"
    
print('Creating tables from Base metadata')
Base.metadata.create_all(engine)

# did not include primary key because we can use auto-incrementing primary key feature of SQLite database
squidward = User(name="squidward", fullname="Squidward Tentacles")
krabs = User(name="ehkrabs", fullname="Eugene H. Krabs")

# create a Session without using a context manager
session = Session(engine)
session.add(squidward)
session.add(krabs)
krabsAddress = Address(email_address="krabs@unc.edu", user_id=2)
# Here we knew that Krab's id was 2, but we need to figure out how to get the id
session.add(krabsAddress)
#print(squidward.id)     # None
session.flush()
#print(krabs.id)         # 2

some_squidward = session.get(User, 1)


some_krabs_address = session.get(Address, krabsAddress.id)

#print(some_squidward)
#print(some_squidward is squidward)      # True because the identity map maintains a unique instance of a particular Python object per a particular database identity

session.commit()
print(some_squidward)     
print(some_krabs_address)          

# session.add(User(name="spongebob", fullname="Spongebob Squarepants"))
# session.add(User(name="sandy", fullname="Sandy Cheeks"))
# session.add(User(name="patrick", fullname="Patrick Star"))
# session.flush()
# session.commit()

# # update
# sandy = session.execute(select(User).filter_by(name="sandy")).scalar_one()
# #print(sandy)
# sandy.fullname = "Sandy Squirrel"
# #print(sandy in session.dirty)
# #session.flush()
# sandy_fullname = session.execute(select(User.fullname).where(User.id == 4)).scalar_one()
# #print(sandy_fullname)

# # delete
# patrick = session.get(User, 5)
# session.delete(patrick)
# session.execute(select(User).where(User.name == "patrick")).first()
# #print(patrick in session)


# # Q7: Using SELECT Statements
# # use Core
# # stmt = select(user_table).where(user_table.c.name == "spongebob")
# # #print(stmt)

# # with engine.connect() as conn:
# #     for row in conn.execute(stmt):
# #         print(row)

# # # use ORM
# # stmt = select(User).where(User.name == "spongebob")
# # with Session(engine) as session:
# #     for row in session.execute(stmt):
# #         print(type(row[0]))

# # print(select(User))
# # row = session.execute(select(User)).first()
# # print(row)
# # user = session.scalars(select(User)).first()
# # print(user)

# # print(select(User.name, User.fullname))
# # row = session.execute(select(User.name, User.fullname)).first()
# # print(row)

# # session.execute(
# #     select(User.name, Address).where(User.id == Address.user_id).order_by(Address.id)
# # ).all()
