from bson import ObjectId, errors
from database.user import retrieve_user, update_user_data, UserNotFoundException
from database.database import courses_collection


class CourseNotFoundException(Exception):
    pass


def course_helper(course) -> dict:
    return {
        "obj_id": str(course['_id']),
        "title": course['title'],
        "semester": course['semester'],
        "lecturer": course['lecturer'],
        "day": course['day'],
        "start_date": str(course['start_date']),
        "end_date": str(course['end_date']),
        "degree": course['degree'],
        "degree_code": course['degree_code']
    }

# _____________________ Courses _________________________


def retrieve_all_courses():
    return [course_helper(course) for course in courses_collection.find().sort("semester", 1)]


def retrieve_course(course_id) -> dict:
    try:
        course = courses_collection.find_one({"_id": ObjectId(course_id)})
        return course_helper(course)
    except CourseNotFoundException as ex:
        raise ex
    except errors.InvalidId as ex:
        raise ex


def retrieve_user_courses(user_id: str):
    try:
        user = retrieve_user(_id=ObjectId(user_id))
        courses = []
        for course_id in user['courses']:
            course = retrieve_course(course_id)
            if course:
                courses.append(course)

        return courses

    except UserNotFoundException as ex:
        raise ex
    except errors.InvalidId as ex:
        raise ex


def search_courses_by_field(field_name, desc):
    try:
        courses = []
        for course in courses_collection.find({field_name : desc}).sort("semester", 1):
            courses.append(course_helper(course))
        return courses
    except CourseNotFoundException as ex:
        raise ex


def add_courses_to_user(user_id: str, courses_id: list):
    try:
        user = retrieve_user(_id=ObjectId(user_id))
        for course_id in courses_id:
            if course_id in user['courses']:
                raise CourseNotFoundException(f"User {user_id} has register to this course {course_id}")
            else:
                user['courses'].append(course_id)

        update_user_data(user_id, user)

    except UserNotFoundException as ex:
        raise ex
    except errors.InvalidId as ex:
        raise ex


def delete_course(user_id: str, course_id: str):
    try:
        user = retrieve_user(_id=ObjectId(user_id))
        if course_id in user['courses']:
            user['courses'].remove(course_id)
            update_user_data(user_id, user)

    except UserNotFoundException as ex:
        raise ex
    except errors.InvalidId as ex:
        raise ex


def delete_list_of_courses(user_id: str, courses_id: list):
    try:
        user = retrieve_user(_id=ObjectId(user_id))
        for course_id in courses_id:
            if course_id in user['courses']:
                user['courses'].remove(course_id)
            else:
                raise CourseNotFoundException
        update_user_data(user_id, user)

    except UserNotFoundException as ex:
        raise ex
    except errors.InvalidId as ex:
        raise ex


def fix_date():
    courses = retrieve_all_courses()
    for i in range(20, len(courses)):
        print(courses[i]['start_date'])
