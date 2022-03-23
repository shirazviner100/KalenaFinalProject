import React, { useContext } from "react";

// react component used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";

import { useHistory } from "react-router-dom";

// dependency plugin for react-big-calendar
import moment from "moment";

// reactstrap components
import {
  Card,
  CardBody,
  Button,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Label,
} from "reactstrap";

import ReactBSAlert from "react-bootstrap-sweetalert";

import AddGeneralEvent from "./forms/AddGeneralEvent";
import AddMultiStudentEvent from "./forms/AddMultiStudentEvent";
import AddNewEventAlert from "./forms/AddEventAlert";

import AuthContext from "./store/auth-context";
import LoadingSpinner from "components/FormElements/LoadingSpinner";
import UpdateEventAlert from "./forms/UpdateEventAlert";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [alert, setAlert] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [eventsLength, setEventsLength] = React.useState(0);

  const auth = useContext(AuthContext);
  const history = useHistory();

  // The function pops up a message representing a selected holiday from the calendar
  const messageToHoliday = (event) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title={event.title}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        <div>
          <br />
          <Label>
            From:{" "}
            {event.start.toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
            })}
          </Label>
          <br />
          <Label>
            To:{" "}
            {event.end.toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
            })}
          </Label>
          <br />
          <Label>{event.description ? event.description : ""}</Label>
          <br />
        </div>
      </ReactBSAlert>
    );
  };

  // function that checks if the user is sure that he/she wants to delete the event
  const deleteEventConfirmationAlert = (event) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure you want to delete the event?"
        onConfirm={() => removeEvent(event)}
        onCancel={hideAlert}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      ></ReactBSAlert>
    );
  };

  // function that removes selected event
  const removeEvent = (event) => {
    setIsLoading(true);
    auth.deleteEvent(event);

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Mission Accomplished!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The meeting has been deleted.
      </ReactBSAlert>
    );
  };

  // function that handles with updating an event
  const updateEventForm = (eventBeforeTheUpdate) => {
    setAlert(
      <UpdateEventAlert
        eventToUpdate={eventBeforeTheUpdate}
        onConfirm={updateEvent}
        onCancel={hideAlert}
        dateError={dateError}
      />
    );
  };

  // function that updates selected event
  const updateEvent = (event) => {
    setIsLoading(true);
    auth.updateEvent(event);
    setIsLoading(false);

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Mission Accomplished!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The meeting has been updated.
      </ReactBSAlert>
    );
  };

  // The function pops up a message representing a selected event from the calendar
  const messageToEvent = (event) => {
    const closeButtonStyle = {
      backgroundImage:
        "linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93)",
      color: "#ffffff",
      borderWidth: "1px",
      borderRadius: "30px",
      padding: "8px 18px",
    };

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title={event.title}
        onConfirm={hideAlert}
        onCancel={hideAlert}
        closeBtnStyle={closeButtonStyle}
        customButtons={
          <>
            <Button
              color="warning"
              onClick={() => deleteEventConfirmationAlert(event)}
            >
              Delete
            </Button>
            {event.participants.length === 0 && (
              <Button color="success" onClick={() => updateEventForm(event)}>
                Update
              </Button>
            )}
          </>
        }
        showCloseButton
        allowEscape
        btnSize=""
      >
        <div>
          <br />
          <Label>The event was created by: {event.creator}</Label>
          <Label>
            <div>
              {event.participants.length > 0 && (
                <Label>
                  The students who confirmed their arrival are: <br />
                </Label>
              )}
              {event.participants.length > 0 &&
                event.participants.map((participant) => (
                  <div>
                    <Label>{participant}</Label>
                    <br />
                  </div>
                ))}
            </div>
          </Label>
          <br />
          <Label>
            From:{" "}
            {event.start.toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Label>
          <br />
          <Label>
            To:{" "}
            {event.end.toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Label>
          {event.description ? (
            <div>
              <Label>Description: {event.description} </Label>
            </div>
          ) : null}
          {event.location ? (
            <div>
              {" "}
              <Label>At: {event.location} </Label>{" "}
            </div>
          ) : null}

          <div>
            <Label>Repeat: {event.repeat}</Label>
          </div>
        </div>
      </ReactBSAlert>
    );
  };

  const moveToCourses = () => {
    history.push("/admin/my-courses");
  };

  // The function pops up a message representing a selected course from the calendar
  const messageCourse = (event) => {
    const closeButtonStyle = {
      backgroundImage:
        "linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93)",
      color: "#ffffff",
      borderWidth: "1px",
      borderRadius: "30px",
      padding: "8px 18px",
    };

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title={event.title}
        onConfirm={() => moveToCourses()}
        onCancel={() => hideAlert()}
        closeBtnStyle={closeButtonStyle}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="info"
        confirmBtnText="Move To See Your Courses"
        showCloseButton
        allowEscape
        btnSize=""
      >
        <div>
          <br />
          <Label>
            From:{" "}
            {event.start.toLocaleString("he-IL", {
              timeZone: "UTC",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Label>
          <br />
          <Label>
            To:{" "}
            {event.end.toLocaleString("he-IL", {
              timeZone: "UTC",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Label>
          <br />
          <Label>{event.description ? event.description : ""}</Label>
          <br />
          <Label>{event.address ? "At: " + event.address : ""}</Label>
          <br />
          <Label>Repeat: {event.repeat}</Label>
          <Label style={{ color: "black" }} tag="h4"></Label>
        </div>
      </ReactBSAlert>
    );
  };

  // function check if the choosen event is course or user event and pop up description message
  const selectedEvent = (event) => {
    if (event.holiday) messageToHoliday(event);
    else if (
      event.description !== "semester A" &&
      event.description !== "semester B"
    ) {
      messageToEvent(event);
    } else {
      messageCourse(event);
    }
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // component to add general event
  const addGeneralEvent = (slot) => {
    setAlert(
      slot === null ? (
        <AddGeneralEvent
          onCancel={hideAlert}
          onConfirm={addCustomEvent}
          resetDate={null}
        />
      ) : (
        <AddGeneralEvent
          resetDate={slot}
          onCancel={hideAlert}
          onConfirm={addCustomEvent}
        />
      )
    );
  };

  // compnent to add multi-student event
  const addMultiEvent = () => {
    setAlert(
      <AddMultiStudentEvent
        title={"Student Appointment"}
        onCancel={hideAlert}
        onConfirm={addMultiStudentEvent}
      />
    );
  };

  // component to add event, the event depends on the button that the user clicked
  const addButtonEventAlert = (myTitle) => {
    setAlert(
      <AddNewEventAlert
        title={myTitle}
        onCancel={hideAlert}
        onConfirm={addCustomEvent}
      />
    );
  };

  const findMeetingClickHandler = () => {
    history.push("/admin/FindMeeting");
  };

  // function that adds an event
  const addCustomEvent = (
    myTitle,
    address,
    description,
    repeat,
    startDate,
    endDate,
    myColor,
    allDay,
    validationState
  ) => {
    if (validationState) {
      if (startDate.getTime() > endDate.getTime()) dateError();
      else {
        let myEvent = {
          creator: auth.userEmail,
          title: myTitle,
          start: startDate,
          end: endDate,
          invitees: [],
          description: description,
          location: address,
          repeat: repeat,
          color: myColor,
          all_day: allDay,
        };
        setAlert(null);

        setIsLoading(true);
        auth.addEvent(true, myEvent);
      }
    } else {
      setIsLoading(false);
      exceptionHandler();
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
  }, []);

  React.useEffect(() => {
    if (auth.userEvents.length > 0) {
      setIsLoading(false);
      setEventsLength(auth.userEvents.length);
    }
  }, [auth.userEvents.length]);

  React.useEffect(() => {
    if (auth.userEvents.length > eventsLength) {
      setIsLoading(false);
      setEventsLength(auth.userEvents.length);
    }
  }, [auth.userEvents]);

  // pop up error message
  const dateError = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Invalid date"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      />
    );
  };

  const passeedDateAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry but it is not possible to make an appointment for a past date."
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="danger"
        btnSize=""
      />
    );
  };

  // function that adds a multi-student event
  const addMultiStudentEvent = (
    myTitle,
    description,
    address,
    repeat,
    inviteesList,
    startDate,
    endDate,
    myColor,
    validation
  ) => {
    if (validation) {
      const today = new Date();
      if (startDate.getTime() < today.getTime()) passeedDateAlert();
      else {
        if (startDate.getTime() > endDate.getTime()) dateError();
        else {
          let myEvent = {
            creator: auth.userEmail,
            title: myTitle,
            start: startDate,
            end: endDate,
            invitees: inviteesList,
            description: description,
            location: address,
            repeat: repeat,
            color: myColor,
            all_day: false,
          };

          setAlert(null);
          setIsLoading(true);
          auth.addEvent(true, myEvent);
        }
      }
    } else {
      setIsLoading(false);
      exceptionHandler();
    }
  };

  React.useEffect(() => {
    if (auth.finishToAdd) {
      setIsLoading(false);
    }
  }, [auth.finishToAdd]);

  // pop up to exception
  const exceptionHandler = () => {
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
      </ReactBSAlert>
    );
  };

  // function that changes the background color of the event
  const eventColors = (event) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor,
    };
  };

  return (
    <>
      <div className="content">
        {alert}
        {auth.isLoggedIn ? (
          <Row>
            <Col className="ml-auto mr-auto">
              <Row>
                <Button
                  onClick={() => findMeetingClickHandler()}
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="info"
                >
                  Find time for a Multi-Participant meeting
                </Button>
              </Row>
              <br />
              <Row>
                <Button
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="default"
                  onClick={addMultiEvent}
                >
                  Add A Multi-Student Event
                </Button>
              </Row>
              <br />
              <Row>
                <Button
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="primary"
                  onClick={() => addButtonEventAlert("Work")}
                >
                  Add Work Schedule
                </Button>
              </Row>
              <br />
              <Row>
                <Button
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="success"
                  onClick={() => addButtonEventAlert("Medical Care")}
                >
                  Add Medical Care
                </Button>
              </Row>
              <br />
              <Row>
                <Button
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="warning"
                  onClick={() => addButtonEventAlert("Workout")}
                >
                  Add Workout Schedule
                </Button>
              </Row>
              <br />
              <Row>
                <Button
                  style={{ margin: "auto", height: "2.5cm", width: "4.5cm" }}
                  color="danger"
                  onClick={() => addGeneralEvent()}
                >
                  Add General Schedule
                </Button>
              </Row>
            </Col>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-calendar">
                <CardBody>
                  {isLoading && <LoadingSpinner asOverlay />}
                  <BigCalendar
                    selectable
                    localizer={localizer}
                    events={auth.userEvents}
                    defaultView="month"
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={(event) => selectedEvent(event)}
                    onSelectSlot={(slot) => addGeneralEvent(slot)}
                    eventPropGetter={eventColors}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <Card style={{ width: "20cm", marginLeft: "7cm", marginTop: "2cm" }}>
            <CardHeader>
              <CardTitle tag="h2">Hello</CardTitle>
            </CardHeader>
            <CardBody>
              <Label tag="h4">
                In order to use our website you must log-in or register.
              </Label>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
};

export default Calendar;
