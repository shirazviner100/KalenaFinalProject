from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from database.holidays import retrieve_holidays, search_holidays_by_field, HolidaysNotFoundException
from models.event import ResponseModel

router = APIRouter()
hash_helper = CryptContext(schemes=["bcrypt"])


@router.get("/get_holidays")
def get_holidays():
    holidays = retrieve_holidays()
    if len(holidays) > 0:
        return ResponseModel(holidays, "holidays data retrieved successfully") 
    else:
        return ResponseModel(holidays, "No holidays")


@router.get("/get_holidays_by_field{field_name}/{description}")
def get_holidays_by_field(field_name, description):
    try:
        holidays = search_holidays_by_field(field_name, description)
        if len(holidays) > 0:
            return ResponseModel(holidays, "holidays data retrieved successfully")
        else:
            return ResponseModel(holidays, "No holidays")
    except HolidaysNotFoundException as ex:
        raise HTTPException(status_code=404, detail=str(ex))
