from fastapi import Body, APIRouter, HTTPException
from bson import ObjectId, errors
from passlib.context import CryptContext

from database.user import remove_user, retrieve_users, retrieve_user,update_user_details, delete_user, \
    UserNotFoundException
from models.user import ResponseModel, ErrorResponseModel, UpdateUserModel

router = APIRouter()
hash_helper = CryptContext(schemes=["bcrypt"])


@router.get("/get_all_users")
async def get_users():
    users = retrieve_users()
    return ResponseModel(users, "Users data retrieved successfully") \
        if len(users) > 0 \
        else ResponseModel(
        users, "Empty list returned")


@router.get("/get_user_data/{obj_id}")
def get_user_data(obj_id):
    try:
        user = retrieve_user(_id=ObjectId(obj_id))
        return ResponseModel(user, "User data retrieved successfully")
    except UserNotFoundException as ex:
        raise HTTPException(status_code=404, detail=str(ex))
    except errors.InvalidId as ex:
        raise HTTPException(status_code=404, detail=str(ex))


@router.put("/update_user/{obj_id}")
def update_user(obj_id: str, req: UpdateUserModel = Body(...)):
    try:
        update_user_details(obj_id, req.dict())
        return ResponseModel("User with ID: {} name update is successful".format(obj_id),
                             "User name updated successfully")
    except UserNotFoundException:
        raise HTTPException(status_code=404, detail="User doesn't exist.")
    except errors.InvalidId as ex:
        raise HTTPException(status_code=404, detail=str(ex))


#for admins:
@router.delete("/delete_user/{admin_id}/{users_id}")
def delete_user(admin_id: str, user_id: str):
    try:
        remove_user(admin_id, user_id)
        return ResponseModel('delete', "User successfully removed.")
    except UserNotFoundException:
        raise HTTPException(status_code=404, detail="User doesn't exist.")
    except errors.InvalidId as ex:
        raise HTTPException(status_code=404, detail=str(ex))
