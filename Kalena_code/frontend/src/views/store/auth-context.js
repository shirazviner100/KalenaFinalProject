import React, { useState, useEffect, useCallback } from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useHttpClient } from "../../components/hooks/http-hook.js";

let logoutTimer;
let userDataTimer;

// Top bar for rehearsals of the courses according to the semester to which they belong
const endOfSemesterA = new Date(2021, 12, 26);
const endOfSemesterB = new Date(2022, 6, 16);
const twoMinutesInterval = 1000 * 60 * 2; // two minutes

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  userId: null,
  user: null,
  userEmail: "",
  userEvents: [],
  finishLoggin: false,
  userCourses: [],
  userDegreeCourses: [],
  friends: [],
  friendsRequests: [],
  login: (userId, token, email, expirationTime) => {},
  logout: () => {},
  updateUser: (firstName, lastName, city, address, degreeValue) => {},
  deleteEvent: (eventToRemove) => {},
  deleteCourse: (courseToDelete) => {},
  addEvent: (message, event) => {},
  updateEvent: (eventToUpdate) => {},
  addCourses: (duplicate, coursesToAdd) => {},
  getFriends: (token, userId) => {},
  updateFriendsRequests: (token, userId) => {},
  userMeetingAnswer: (answerUrl, invite, update) => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(false);
  const [userEmail, setUserEmail] = useState(false);
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState(null);
  const [courses, setCourses] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [degreeCourses, setDegreeCourses] = useState([]);
  const [userNotification, setUserNotification] = useState([]);
  const [finishLoggin, setFinishLoggin] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequestList, setFriendRequestList] = useState([]);

  const [coursesAsEvents, setCoursesAsEvents] = useState([]);
  const [newCoursesAsEventsLength, setNewCoursesAsEventsLength] = useState(-1);
  const { sendRequest } = useHttpClient();

  const userIsLoggedIn = !!token; // if token is not an empty string than token = true, else token = false

  // function that handles with logged in user
  const loginHandler = useCallback((uid, token, email, expirationTime) => {
    setToken(token);
    setUserId(uid);
    setUserEmail(email);
    setFinishLoggin(false);

    // storage the token even if there is a "refresh" on the website
    // if the token wasn't a primitve, but maybe an object
    // so first we would convert into json (string)

    const hour = 1000 * 60 * 60;

    const tokenExpirationDate =
      expirationTime || new Date(new Date().getTime() + hour);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        userEmail: email,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );

    getUserData(token, uid);
    getEvents(token, uid);
    getInvitations(token, uid);
    getFriendsRequest(token, uid);
    getFriends(token, uid);
  }, []);

  const getUserData = async (token, userId) => {
    const urlUserData = `http://localhost:8080/user/get_user_data/${userId}`;

    try {
      const responseData = await sendRequest(urlUserData, "GET", null, {
        Authorization: "Bearer " + token,
      });

      const user = responseData.data;
      setUserData(user);
      setCoursesByDegree(user.degree, token);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that sets courses by degree
  const setCoursesByDegree = async (userDegree, token) => {
    const urlCourses = `http://localhost:8080/courses/get_courses_by_field/degree/${userDegree}`;

    try {
      const responseData = await sendRequest(urlCourses, "GET", null, {
        Authorization: "Bearer " + token,
      });

      const degreeCourses = responseData.data;
      setDegreeCourses(degreeCourses);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that updates user's data
  const updateUser = (firstName, lastName, city, address, degreeValue) => {
    if (userData.first_name !== firstName) {
      userData.first_name = firstName;
    }
    if (userData.last_name !== lastName) {
      userData.last_name = lastName;
    }
    if (userData.city !== city) {
      userData.city = city;
    }
    if (userData.address !== address) {
      userData.address = address;
    }
    if (userData.degree !== degreeValue) {
      userData.degree = degreeValue;
      setCoursesByDegree(degreeValue, token);
    }
  };

  // function that handles the notification depends on the answer of the user
  const userMeetingAnswer = async (answerUrl, invite, update) => {
    try {
      await sendRequest(answerUrl, "PUT", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });

      filterByInvitation(invite.obj_id);
      if (update) getEvents(token, userId);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  //function that removes invitation by id
  const filterByInvitation = (id) => {
    let newNotification = userNotification.filter(
      (notify) => notify.obj_id !== id
    );
    setUserNotification(newNotification);
  };

  // removing event
  const removeEvents = async (eventToRemove) => {
    const url = `http://localhost:8080/event/delete_event/${userId}/${eventToRemove.obj_id}`;

    try {
      await sendRequest(url, "DELETE", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });

      removeByObjId(eventToRemove.obj_id);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that removes event from events list by obj_id
  const removeByObjId = (obj_id) => {
    let newEvents = events.filter((event) => event.obj_id !== obj_id);
    setEvents(newEvents);
  };

  // function that correctly converts the hours so that it is stored correctly in the DB
  const correctStartAndEnd = (eventToUpdate) => {
    const startDateHours =
      eventToUpdate.start.getHours() -
      eventToUpdate.start.getTimezoneOffset() / 60;
    const endDateHours =
      eventToUpdate.end.getHours() - eventToUpdate.end.getTimezoneOffset() / 60;

    const eventToUpdateClone = JSON.parse(JSON.stringify(eventToUpdate)); // deep copy

    eventToUpdateClone.start = new Date(eventToUpdateClone.start);
    eventToUpdateClone.end = new Date(eventToUpdateClone.end);

    eventToUpdateClone.start.setHours(startDateHours);
    eventToUpdateClone.end.setHours(endDateHours);

    return jsonModification(eventToUpdateClone);
  };

  //updating event
  const updateEvent = async (eventToUpdate) => {
    const url = `http://localhost:8080/event/update_event/${userId}/${eventToUpdate.obj_id}`;

    const [startDate, endDate] = correctStartAndEnd(eventToUpdate);

    try {
      await sendRequest(
        url,
        "PATCH",
        JSON.stringify({
          title: eventToUpdate.title,
          start_date: startDate,
          end_date: endDate,
          description: eventToUpdate.description,
          location: eventToUpdate.location,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that handles with logged outuser
  const logoutHandler = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUserEmail(null);
    setCoursesAsEvents([]);
    setNewCoursesAsEventsLength(-1);
    setFinishLoggin(false);

    localStorage.removeItem("userData");
  }, []);

  // Auto-Logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, tokenExpirationDate]);

  // function that gets user's courses
  const getCourses = async (events, userId, token) => {
    const urlUserCourses = `http://localhost:8080/courses/get_all_user_courses/${userId}`;

    try {
      const responseData = await sendRequest(urlUserCourses, "GET", null, {
        Authorization: "Bearer " + token,
      });

      const userCourses = responseData.data;
      setCourses(userCourses);
      addCoursesToCalendar(events, userCourses);
      setFinishLoggin(true);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // Auto-Login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      loginHandler(
        storedData.userId,
        storedData.token,
        storedData.userEmail,
        new Date(storedData.expiration)
      );
    }
  }, [loginHandler]);

  // function that adds jewish holidays to the calendar
  // runs only when user logged in
  const addHolidays = async (allEvents, userId, token) => {
    const urlHolidays = `http://localhost:8080/holidays/get_holidays`;

    try {
      const responseData = await sendRequest(urlHolidays, "GET", null, {
        Authorization: "Bearer " + token,
      });

      const holidays = responseData.data;
      let events = allEvents;
      for (let i = 0; i < holidays.length; i++) {
        holidays[i].start = new Date(holidays[i].start_date);
        holidays[i].end = new Date(holidays[i].start_date);
        holidays[i].allDay = holidays[i].all_day;
        holidays[i].color = "holiday";
        holidays[i].holiday = true;
        events.push(holidays[i]);
      }

      setHolidays(holidays);
      getCourses(events, userId, token);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that adds semester A courses with repeat
  const addBySemester = (
    events,
    semesterA,
    semesterB,
    coursesAsEventsList = coursesAsEvents
  ) => {
    if (newCoursesAsEventsLength === -1) {
      coursesAsEventsList = [];
    }

    for (var i = 0; i < semesterA.length; i++) {
      let startDate = semesterA[i].start;
      let endDate = semesterA[i].end;
      while (startDate.getTime() < endOfSemesterA.getTime()) {
        events.push({
          obj_id: semesterA[i].obj_id,
          title: semesterA[i].title,
          creator: null,
          invitees: [],
          start: startDate,
          end: endDate,
          description: semesterA[i].description,
          address: semesterA[i].address,
          allDay: false,
          repeat: semesterA[i].repeat,
          color: "school",
        });

        coursesAsEventsList.push({
          obj_id: semesterA[i].obj_id,
          title: semesterA[i].title,
          creator: null,
          invitees: [],
          start: startDate,
          end: endDate,
          description: semesterA[i].description,
          address: semesterA[i].address,
          allDay: false,
          repeat: semesterA[i].repeat,
          color: "school",
        });

        // Promote the date a week ahead to create rehearsals
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 7,
          startDate.getHours(),
          startDate.getMinutes()
        );

        endDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate() + 7,
          endDate.getHours(),
          endDate.getMinutes()
        );
      }
    }

    addSemesterBToCalendar(events, semesterB, coursesAsEventsList);
  };

  const deleteCourseMessage = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Courses were removed successfuly!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      ></ReactBSAlert>
    );
  };

  // function that modifies the JSON
  const jsonModification = (event) => {
    const jsonStartDate = event.start.toJSON();
    const jsonEndDate = event.end.toJSON();
    const startDate =
      jsonStartDate.substring(0, jsonStartDate.indexOf(".")) +
      localGMTdifference(event.start);
    const endDate =
      jsonEndDate.substring(0, jsonEndDate.indexOf(".")) +
      localGMTdifference(event.end);

    return [startDate, endDate];
  };

  // function that is responsible for the logic of time differences between UTC and local time
  const timeDifferences = (event) => {
    const startDateHours =
      event.start.getHours() - event.start.getTimezoneOffset() / 60;
    const endDateHours =
      event.end.getHours() - event.end.getTimezoneOffset() / 60;

    event.start.setHours(startDateHours);
    event.end.setHours(endDateHours);

    return jsonModification(event);
  };

  // function that adds an event to the calendar
  const addEvent = async (message, event) => {
    const [startDate, endDate] = timeDifferences(event);

    const url = `http://localhost:8080/event/post_event/${userId}`;

    try {
      const responseData = await sendRequest(
        url,
        "POST",
        JSON.stringify({
          creator: userEmail,
          title: event.title,
          start_date: startDate,
          end_date: endDate,
          invitees: event.invitees,
          description: event.description,
          location: event.location,
          repeat: event.repeat,
          color: event.color,
          all_day: event.all_day,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      let newEvents = doAddEvent(responseData.data);
      setEvents([]);
      setEvents(newEvents);
      if (message) addEventAlert();
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  const addEventAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Event was added successfuly!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      ></ReactBSAlert>
    );
  };

  const doAddEvent = (data) => {
    let newEvents = events;
    let allTheEvents = data;

    for (let i = 0; i < allTheEvents.length; i++) {
      allTheEvents[i].start = new Date(allTheEvents[i].start_date);
      allTheEvents[i].end = new Date(allTheEvents[i].end_date);

      newEvents.push(allTheEvents[i]);
    }
    return newEvents;
  };

  // function that adds semester B courses with repeat
  const addSemesterBToCalendar = (events, semesterB, coursesAsEventsList) => {
    for (var i = 0; i < semesterB.length; i++) {
      let startDate = semesterB[i].start;
      let endDate = semesterB[i].end;
      while (startDate.getTime() < endOfSemesterB.getTime()) {
        events.push({
          obj_id: semesterB[i].obj_id,
          title: semesterB[i].title,
          creator: null,
          invitees: [],
          start: startDate,
          end: endDate,
          description: semesterB[i].description,
          address: semesterB[i].address,
          allDay: false,
          repeat: semesterB[i].repeat,
          color: "school",
        });

        coursesAsEventsList.push({
          obj_id: semesterB[i].obj_id,
          title: semesterB[i].title,
          creator: null,
          invitees: [],
          start: startDate,
          end: endDate,
          description: semesterB[i].description,
          address: semesterB[i].address,
          allDay: false,
          repeat: semesterB[i].repeat,
          color: "school",
        });

        // Promote the date a week ahead to create rehearsals
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 7,
          startDate.getHours(),
          startDate.getMinutes()
        );

        endDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate() + 7,
          endDate.getHours(),
          endDate.getMinutes()
        );
      }
    }

    setNewCoursesAsEventsLength(coursesAsEventsList.length);
    setCoursesAsEvents(coursesAsEventsList);
    setEvents(events);
  };

  // update user friends list by getting the list from DB
  const getFriends = async (token, userId) => {
    const urlUserFriends = `http://localhost:8080/friends/get_friends_list/${userId}`;

    try {
      const responseData = await sendRequest(urlUserFriends, "GET", null, {
        Authorization: "Bearer " + token,
      });

      const friends = responseData.data;
      setFriends(friends);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // getting user friends requestes by getting the list from DB
  const getFriendsRequest = async (token, userId) => {
    const urlFriendRequestList = `http://localhost:8080/friends/get_friend_requests/${userId}`;

    try {
      const responseData = await sendRequest(
        urlFriendRequestList,
        "GET",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );

      const friendsRequest = responseData.data;
      setFriendRequestList(friendsRequest);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that removes course from DB and calendar events
  const removeCourse = async (coursesToRemove) => {
    const urlRemoveCourses = `http://localhost:8080/courses/delete_list_of_courses/${userId}`;

    try {
      await sendRequest(
        urlRemoveCourses,
        "PATCH",
        JSON.stringify({
          courses_list: coursesToRemove,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      filterCoursesAndEvents(coursesToRemove);
      deleteCourseMessage();
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  const addUserCourses = async (duplicate, coursesToAdd) => {
    let coursesToAddById = coursesToAdd.map((course) => course.obj_id);

    // add the new courses
    const urlAddCourses = `http://localhost:8080/courses/add_courses_to_user/${userId}`;

    try {
      await sendRequest(
        urlAddCourses,
        "PATCH",
        JSON.stringify({
          courses_list: coursesToAddById,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      let currentCourses = courses;
      for (let i = 0; i < coursesToAdd.length; i++)
        currentCourses.push(coursesToAdd[i]);

      setCourses(currentCourses);
      addCoursesToCalendar(events, coursesToAdd);
      if (duplicate) duplicateCoursesHandler();
      else addedCoursesSuccessfuly();
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that alerts about duplicated courses of the user
  const duplicateCoursesHandler = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Courses were added successfuly!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        There have been courses added to the system in the past, so they have
        not been added again
      </ReactBSAlert>
    );
  };

  // function that messages a successful add of courses to the user
  const addedCoursesSuccessfuly = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Courses were added successfuly!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      ></ReactBSAlert>
    );
  };

  // function that adds courses to events array with repeating date
  const addCoursesToCalendar = (events, courses) => {
    let myEvent;
    let semesterA = [];
    let semesterB = [];
    let description = "";

    for (var i = 0; i < courses.length; i++) {
      if (courses[i].semester === "A") {
        description = "semester A";
      } else {
        description = "semester B";
      }

      myEvent = {
        obj_id: courses[i].obj_id,
        title: courses[i].title + " by " + courses[i].lecturer,
        creator: null,
        invitees: [],
        start: new Date(courses[i].start_date),
        end: new Date(courses[i].end_date),
        description: description,
        address: "MTA",
        allDay: false,
        repeat: "weekly",
        color: "school",
      };

      if (courses[i].semester === "A") {
        semesterA.push(myEvent);
      } else {
        semesterB.push(myEvent);
      }
    }

    addBySemester(events, semesterA, semesterB);
  };

  // function that gets the notifications from the server
  const getInvitations = async (token, userId) => {
    const urlUserNotifications = `http://localhost:8080/event/get_event_invitations/${userId}`;

    try {
      const responseData = await sendRequest(
        urlUserNotifications,
        "GET",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );

      const notifications = responseData.data;
      setUserNotification(notifications);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // filtering the courses and events array after deleting course
  const filterCoursesAndEvents = (coursesToDelete) => {
    let userCoursesAsEvents = coursesAsEvents;
    let userCourses = courses;
    let userEvents = events;

    for (let i = 0; i < coursesToDelete.length; i++) {
      userCoursesAsEvents = userCoursesAsEvents.filter(
        (course) => course.obj_id !== coursesToDelete[i]
      );
      userCourses = userCourses.filter(
        (course) => course.obj_id !== coursesToDelete[i]
      );
      userEvents = userEvents.filter(
        (event) => event.obj_id !== coursesToDelete[i]
      );
    }

    setNewCoursesAsEventsLength(userCoursesAsEvents.length);
    setCoursesAsEvents(userCoursesAsEvents);
    setCourses(userCourses);
    setEvents(userEvents);
  };

  // function that checks if its daylight time or standard time
  const isDST = (date) => {
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== date.getTimezoneOffset();
  };

  // function that gets the local GMT difference
  const localGMTdifference = (date) => {
    return isDST(date) ? "+03:00" : "+02:00";
  };

  // function that gets the user events
  const getEvents = async (token, userId) => {
    const urlUserEvents = `http://localhost:8080/event/get_user_events/${userId}`;

    try {
      const responseData = await sendRequest(urlUserEvents, "GET", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });

      let events = responseData.data;
      for (let i = 0; i < events.length; i++) {
        events[i].start = new Date(events[i].start_date);
        events[i].end = new Date(events[i].end_date);
      }

      if (holidays.length === 0) {
        addHolidays(events, userId, token);
      } else {
        // to prevent holidays GET request
        events = [...events, ...holidays, ...coursesAsEvents];
        setEvents(events);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that gets user's data every 2 minutes
  const userDataIntervalHandler = () => {
    getEvents(token, userId);
    getFriends(token, userId);
    getFriendsRequest(token, userId);
    getInvitations(token, userId);
  };

  useEffect(() => {
    if (
      token &&
      userId &&
      holidays.length !== 0 &&
      coursesAsEvents.length === newCoursesAsEventsLength
    ) {
      userDataTimer = setInterval(userDataIntervalHandler, twoMinutesInterval);
    }

    return () => {
      clearInterval(userDataTimer);
    };
  }, [
    token,
    userId,
    holidays.length,
    coursesAsEvents.length,
    newCoursesAsEventsLength,
  ]);

  const hideAlert = () => {
    setAlert(null);
  };

  // pop up to exception
  const exceptionHandler = (err) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        Something did not work. <br />
        Please try again and check the values ​​you have entered.
        {<div>{err}</div>}
      </ReactBSAlert>
    );
  };

  // returned value
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    userId: userId,
    user: userData,
    userEmail: userEmail,
    userEvents: events,
    userCourses: courses,
    userDegreeCourses: degreeCourses,
    finishLoggin: finishLoggin,
    userNotification: userNotification,
    friends: friends,
    friendsRequests: friendRequestList,
    login: loginHandler,
    logout: logoutHandler,
    updateUser: updateUser,
    deleteCourses: removeCourse,
    deleteEvent: removeEvents,
    addEvent: addEvent,
    updateEvent: updateEvent,
    addCourses: addUserCourses,
    userMeetingAnswer: userMeetingAnswer,
    updateFriends: getFriends,
    updateFriendsRequests: getFriendsRequest,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {alert}
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
