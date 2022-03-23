import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Col,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Label,
} from "reactstrap";

import LoadingSpinner from "components/FormElements/LoadingSpinner";
import ReactBSAlert from "react-bootstrap-sweetalert";
import AuthContext from "views/store/auth-context";
import { useHttpClient } from "../../components/hooks/http-hook.js";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FindMeeting = () => {
  //hour value state and validation state
  const [hourRequest, setHourRequest] = React.useState(0);
  const [hoursState, setHoursState] = React.useState("");

  //update meeting list by DB recomendation
  const [meetingList, setMeetingList] = React.useState([]);

  //if find butto was activate
  const [find, setFind] = React.useState(false);

  //loading spinner state
  const [isLoading, setIsLoading] = React.useState(false);

  //multi-student email states
  const [emailNo1, setemailNo1] = React.useState("");
  const [emailStateNo1, setemailStateNo1] = React.useState("");

  const [emailNo2, setemailNo2] = React.useState("");
  const [emailStateNo2, setemailStateNo2] = React.useState("");

  const [emailNo3, setemailNo3] = React.useState("");
  const [emailStateNo3, setemailStateNo3] = React.useState("");

  const [emailNo4, setemailNo4] = React.useState("");
  const [emailStateNo4, setemailStateNo4] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [titleState, setTitleState] = React.useState("");

  //data states
  const [description, setDescription] = React.useState("");

  //line number state value and validation value
  const [lineNumberState, setLineNumberState] = React.useState("");
  const [lineNumberChoice, setLineNumberChoice] = React.useState("");
  const [meetingUpload, setMeetingUpload] = React.useState(false);

  const [alert, setAlert] = React.useState(null);

  const { sendRequest } = useHttpClient();

  const authCtx = useContext(AuthContext);
  const hoursThreshold = [1, 1.5, 2, 2.5, 3, 3.5, 4];

  //dictionary to save all days (key = day name, value = new Date())
  let all_days = {};
  const history = useHistory();

  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const convertDate = () => {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      let day_by_name = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      all_days[days[day_by_name.getDay()]] = day_by_name;
    }
  };

  //verify that value is integer between 1- length
  const verifyLineNumber = (value) => {
    let mask = /^-?[0-9]+$/;
    if (
      value.target.value >= 1 &&
      value.target.value <= meetingList.length &&
      mask.test(value.target.value)
    ) {
      setLineNumberState("has-success");
      setLineNumberChoice(value.target.value);
    } else setLineNumberState("has-danger");
  };

  //when meeting list changes the flag find activate
  React.useEffect(() => {
    if (meetingList.length > 0) setFind(true);
    else setFind(false);
  }, [meetingList]);

  // Puts the students' emails into the array to send to the database
  const getStudentList = (addCreator) => {
    let participants = [];

    if (emailNo1 !== "" && emailStateNo1 === "has-success") {
      participants.push(emailNo1);
    }

    if (emailNo2 !== "" && emailStateNo2 === "has-success") {
      participants.push(emailNo2);
    }

    if (emailNo3 !== "" && emailStateNo3 === "has-success") {
      participants.push(emailNo3);
    }

    if (emailNo4 !== "" && emailStateNo4 === "has-success") {
      participants.push(emailNo4);
    }

    if (participants.length > 0 && addCreator) {
      participants.push(authCtx.userEmail);
    }

    return participants;
  };

  //exception pop-up
  const exceptionHandler = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Something did not work. <br />
        Please try again and check the values ​​you have entered.
      </ReactBSAlert>
    );
  };

  // no recommendation alert
  const noRecommendetionsAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="No shared free time has been found"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      ></ReactBSAlert>
    );
  };

  // function that gets students list to invite and gets from DB meeting hours recomendation
  const getHourRequest = async (studentList) => {
    const urlMeeting = "http://localhost:8080/meetings/find_meeting";

    try {
      setIsLoading(true);

      const responseData = await sendRequest(
        urlMeeting,
        "POST",
        JSON.stringify({
          duration_session: hourRequest,
          email: studentList,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );

      let meetingRecommendetions = responseData.data;

      if (meetingRecommendetions.length === 0) noRecommendetionsAlert();

      let startDate, endDate;
      convertDate();

      for (let i = 0; i < meetingRecommendetions.length; i++) {
        startDate = new Date(mySetDate(meetingRecommendetions[i], 1));
        endDate = new Date(mySetDate(meetingRecommendetions[i], 2));
        meetingRecommendetions[i].start_date = startDate;
        meetingRecommendetions[i].end_date = endDate;
      }

      setMeetingList(meetingRecommendetions);
      setIsLoading(false);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      setIsLoading(false);
      exceptionHandler();
    }
  };

  //set date hour depends integer or float number
  const mySetDate = (meeting, index) => {
    let myDate = new Date(all_days[meeting[0]]);
    if (meeting[index].toString().includes(".")) {
      let hour = meeting[index]
        .toString()
        .substring(0, meeting[index].toString().indexOf("."));
      myDate.setHours(hour, 30);
    } else {
      myDate.setHours(meeting[index]);
    }

    return myDate;
  };

  const successMessage = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Event was added successfuly!!!"
        onConfirm={moveToCalendar}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        An invitation to this event has been sent.
      </ReactBSAlert>
    );
  };

  const moveToCalendar = () => {
    history.push("/admin/calendar");
  };

  //function check that value is integer between 1-4
  const verifyHours = (value) => {
    if (hoursThreshold.includes(Number(value.target.value))) {
      setHoursState("has-success");
      setHourRequest(value.target.value);
    } else setHoursState("has-danger");
  };

  //adding the recomend meeting by line number choice
  const addClick = () => {
    if (lineNumberState === "has-success" && titleState === "has-success") {
      let myEvent = {
        creator: authCtx.userEmail,
        title: title,
        start: meetingList[lineNumberChoice - 1].start_date,
        end: meetingList[lineNumberChoice - 1].end_date,
        invitees: getStudentList(false),
        description: description,
        location: null,
        repeat: "None",
        color: "find",
        all_day: false,
      };

      setIsLoading(true);
      authCtx.addEvent(false, myEvent);
      setIsLoading(false);
      successMessage();
    } else {
      setIsLoading(false);
      requireMessage();
    }
  };

  React.useEffect(() => {
    setMeetingUpload(true);
  }, [meetingList]);

  //state function to chnge states value by state name
  const stateFunctions = {
    // form values
    setemailNo1: (value) => setemailNo1(value),
    setemailNo2: (value) => setemailNo2(value),
    setemailNo3: (value) => setemailNo3(value),
    setemailNo4: (value) => setemailNo4(value),

    // states to lable output
    setemailStateNo1: (value) => setemailStateNo1(value),
    setemailStateNo2: (value) => setemailStateNo2(value),
    setemailStateNo3: (value) => setemailStateNo3(value),
    setemailStateNo4: (value) => setemailStateNo4(value),
  };

  //changing email state value by the input email number
  const change = (event, stateName, number) => {
    if (verifyEmail(event.target.value)) {
      stateFunctions["set" + stateName + "StateNo" + number]("has-success");
    } else {
      stateFunctions["set" + stateName + "StateNo" + number]("has-danger");
    }
    stateFunctions["set" + stateName + "No" + number](event.target.value);
  };

  //validation pop-up
  const requireMessage = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Error !!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Fields: Line number and title must be full
      </ReactBSAlert>
    );
  };

  //chack title validation
  const changeTitle = (title) => {
    if (title === "Welcome to Kalena" || title === "") {
      setTitleState("has-danger");
    } else {
      setTitleState("has-success");
    }
    setTitle(title);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  //function send request to DB to get meeting hours recomendation
  const findClick = () => {
    let studentList = getStudentList(true);

    if (
      studentList.length > 0 &&
      hourRequest !== 0 &&
      hoursState === "has-success"
    ) {
      getHourRequest(studentList);
    } else {
      setAlert(
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Sorry !!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="OK"
          btnSize=""
        >
          Invalid Input.
        </ReactBSAlert>
      );
    }
  };

  return (
    <div className="content">
      {alert}
      {authCtx.isLoggedIn ? (
        <div>
          <Col>
            <Card style={{ width: "23cm" }}>
              <CardHeader>
                <Label tag="h4">
                  Add user's email to schedule a joint meeting:
                </Label>
              </CardHeader>
              <CardBody>
                <Form action="#">
                  <Label>#1 Student Email:</Label>
                  <FormGroup className={emailStateNo1}>
                    <Input
                      value={emailNo1}
                      name="email"
                      type="text"
                      onChange={(e) => change(e, "email", "1")}
                    />
                    {emailStateNo1 === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        Please enter a valid email address.
                      </label>
                    ) : null}
                  </FormGroup>
                  <Label>#2 Student Email:</Label>
                  <FormGroup className={emailStateNo2}>
                    <Input
                      value={emailNo2}
                      name="email"
                      type="text"
                      onChange={(e) => change(e, "email", "2")}
                    />
                    {emailStateNo2 === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        Please enter a valid email address.
                      </label>
                    ) : null}
                  </FormGroup>
                  <Label>#3 Student Email:</Label>
                  <FormGroup className={emailStateNo3}>
                    <Input
                      value={emailNo3}
                      name="email"
                      type="text"
                      onChange={(e) => change(e, "email", "3")}
                    />
                    {emailStateNo3 === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        Please enter a valid email address.
                      </label>
                    ) : null}
                  </FormGroup>
                  <Label>#4 Student Email:</Label>
                  <FormGroup className={emailStateNo4}>
                    <Input
                      value={emailNo4}
                      name="email"
                      type="text"
                      onChange={(e) => change(e, "email", "4")}
                    />
                    {emailStateNo4 === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        Please enter a valid email address.
                      </label>
                    ) : null}
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "23cm" }}>
              <CardHeader>
                <Label tag="h4">
                  Enter the desired hours to schedule the meeting:
                </Label>
              </CardHeader>
              {isLoading && <LoadingSpinner asOverlay />}
              <CardBody>
                <Row>
                  <Col md="10">
                    <Input onChange={(e) => verifyHours(e)} />
                    <br />
                    {hoursState === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        The hour value must be between 1 to 4 (an half hour
                        intervals).
                      </label>
                    ) : null}
                  </Col>
                </Row>

                <Button onClick={() => findClick()}>Find</Button>
              </CardBody>
            </Card>
          </Col>

          <div>
            {find ? (
              <Col>
                <Card style={{ width: "23cm" }}>
                  <CardBody>
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th className="text-center">Line No.</th>
                          <th className="text-center">Start</th>
                          <th className="text-center">End</th>
                        </tr>
                      </thead>
                      <tbody key="tbody">
                        {meetingList.map((meeting, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {new Date(meeting.start_date).toLocaleString(
                                "he-IL",
                                {
                                  timeZone: "Asia/Jerusalem",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  weekday: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </td>
                            <td className="text-center">
                              {new Date(meeting.end_date).toLocaleString(
                                "he-IL",
                                {
                                  timeZone: "Asia/Jerusalem",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  weekday: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <br />
                    <br />
                    {meetingUpload && (
                      <div>
                        <Label tag="h5">
                          Please select a line number that indicates the desired
                          meeting:
                        </Label>
                        <Input
                          style={{ width: "10cm" }}
                          onChange={(e) => verifyLineNumber(e)}
                        />
                        <br />
                        {lineNumberState === "has-danger" ? (
                          <label style={{ color: "red" }} className="error">
                            Invalid number: value must be an integer in the
                            table range.
                          </label>
                        ) : null}

                        <br />
                        <Label tag="h5">Add meeting title:</Label>
                        <Input
                          value={title}
                          style={{ width: "10cm" }}
                          onChange={(e) => changeTitle(e.target.value)}
                        />
                        {titleState === "has-danger" && (
                          <label style={{ color: "red" }} className="error">
                            This field is required, and has to be different then
                            'Welcome to Kalena'
                          </label>
                        )}
                        <br />
                        <Label tag="h5">Add meeting description</Label>
                        <Input
                          style={{ width: "10cm" }}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <br />
                        {isLoading && <LoadingSpinner asOverlay />}
                        <Button
                          color={
                            titleState === "has-success" &&
                            lineNumberState === "has-success"
                              ? "success"
                              : "title"
                          }
                          onClick={() => addClick()}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ) : null}
          </div>
        </div>
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
  );
};

export default FindMeeting;
