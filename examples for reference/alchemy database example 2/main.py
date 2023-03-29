from fastapi import FastAPI, Depends, HTTPException
from user_service import UserService, User

app = FastAPI()

@app.get("/api/users")
def get_users(user_service: UserService = Depends()) -> list[User]:
    return user_service.all()


@app.post("/api/users")
def new_user(user: User, user_service: UserService = Depends()) -> User:
    try:
        user = user_service.create(user)
        return user
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    

@app.get("/api/users/{pid}", responses={404: {"model": None}})
def get_user(pid: int, user_service: UserService = Depends()) -> User:
    try: 
        user = user_service.get(pid)
        if user == None:
            raise HTTPException(status_code=404)
        return user
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
   

@app.delete("/api/users/{pid}")
def delete_user(pid: int, user_service = Depends(UserService)):
    try:
        user_service.delete(pid)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
