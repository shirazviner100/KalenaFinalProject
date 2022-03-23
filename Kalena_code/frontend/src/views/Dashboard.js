import React, { useContext } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Label,
  CardFooter,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

import { useHistory } from "react-router-dom";
import AuthContext from "./store/auth-context";
import LoadingSpinner from "components/FormElements/LoadingSpinner";

const Dashboard = () => {
  const [alert, setAlert] = React.useState(null);
  const [friendRequestsCounter, setFriendRequestsCounter] = React.useState(0);
  const [notificationsCounter, setNotificationsCounter] = React.useState(0);
  const [firstName, setFirstName] = React.useState("");
  const [degreeCourses, setDegreeCourses] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [finishedLoadingRequest, setFinishedLoadingRequest] =
    React.useState(false);
  const [finishedLoadingNotifications, setFinishedLoadingNotifications] =
    React.useState(false);

  let chosenCourses = {};

  const authCtx = useContext(AuthContext);

  React.useEffect(() => {
    setIsLoading(true);
    setFirstName(authCtx.user.first_name);
    setDegreeCourses(authCtx.userDegreeCourses);
    setIsLoading(false);
  }, [authCtx.user.first_name, authCtx.userDegreeCourses]);

  React.useEffect(() => {
    setNotificationsCounter(authCtx.userNotification.length);
    setFinishedLoadingNotifications(true);
  }, [authCtx.userNotification]);

  React.useEffect(() => {
    setFriendRequestsCounter(authCtx.friendsRequests.length);
    setFinishedLoadingRequest(true);
  }, [authCtx.friendsRequests]);

  const emptyListAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => resetCheckbox()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        No courses selected.
        <br />
        To add courses to the system, mark the desired courses.
      </ReactBSAlert>
    );
  };

  const history = useHistory();

  const updateProfileHandler = () => {
    history.push("/admin/user-profile");
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // function that compares courses by id
  const compareCourse = (id) => {
    let userCourses = authCtx.userCourses;
    for (var i = 0; i < userCourses.length; i++) {
      if (id === userCourses[i].obj_id) return true;
    }

    return false;
  };

  // pop up to exception
  const exceptionHandler = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => resetCheckbox()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The chosen courses already have been added to your course's stack.{" "}
        <br />
        Please choose another courses you would like to add.
      </ReactBSAlert>
    );
  };

  // funcion that resets all the check boxes after being selected
  const resetCheckbox = () => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((element) => (element.checked = false));

    setIsLoading(false);
    hideAlert();
  };

  // function that adds new courses to the user
  const addCoursesHandler = () => {
    setIsLoading(true);
    // checks if new courses are added
    if (Object.keys(chosenCourses).length === 0) emptyListAlert();
    else {
      let isOldCourse = false;
      let studCourses = [];
      let hasChanged = false;
      for (let key in chosenCourses) {
        if (chosenCourses[key].get === 1) {
          if (!compareCourse(key)) {
            hasChanged = true;
            studCourses.push(chosenCourses[key].body);
          } else {
            isOldCourse = true;
          }
        }
      }
      if (hasChanged) {
        if (isOldCourse) {
          authCtx.addCourses(true, studCourses);
        } else {
          authCtx.addCourses(false, studCourses);
        }
        resetCheckbox();
      } else {
        exceptionHandler();
      }
    }
  };

  const friendZoneHandler = () => {
    history.push("/admin/Friends");
  };

  // function that checks if the course has been selected
  const checkBoxHandler = (course) => {
    if (!chosenCourses.hasOwnProperty(course.obj_id)) {
      chosenCourses[course.obj_id] = {
        get: 1,
        body: course,
      };
    } else {
      if (chosenCourses[course.obj_id].get === 0)
        chosenCourses[course.obj_id].get = 1;
      else chosenCourses[course.obj_id].get = 0;
    }
  };

  return (
    <>
      <div className="content">
        {alert}
        <div
          style={{
            margin: "auto",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            style={{ height: "6.5cm", width: "20cm" }}
            alt="..."
            src={require("assets/img/logoT.png").default}
          />
        </div>
        <br />
        <br />

        <Row className="justify-content-md-center">
          {authCtx.isLoggedIn && (
            <Col lg="3" md="6">
              <Card
                style={{ height: "4cm", width: "7.5cm" }}
                className="card-stats"
              >
                {isLoading && <LoadingSpinner asOverlay />}
                <CardBody>
                  <Row>
                    <Col className="text-rigth">
                      <CardTitle tag="h2">Welcome Back</CardTitle>
                      <CardTitle tag="h4">{firstName}</CardTitle>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          )}
          {authCtx.isLoggedIn && (
            <Col lg="3" md="6">
              <Card
                style={{ height: "4cm", width: "7.5cm" }}
                className="card-stats"
              >
                {isLoading && <LoadingSpinner asOverlay />}
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-primary">
                        <i className="tim-icons icon-pencil" />
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Update details</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i
                      className="tim-icons icon-tap-02"
                      onClick={updateProfileHandler}
                    >
                      &nbsp;&nbsp;move to User Profile
                    </i>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          )}
          {authCtx.isLoggedIn && (
            <Col lg="3" md="6">
              <Card
                style={{ height: "4cm", width: "7.5cm" }}
                className="card-stats"
              >
                {!finishedLoadingRequest && <LoadingSpinner asOverlay />}
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-success">
                        <i className="tim-icons icon-single-copy-04" />
                      </div>
                    </Col>
                    {finishedLoadingRequest && (
                      <Col xs="7">
                        <div className="numbers">
                          <p className="card-category">You have</p>
                          <CardTitle tag="h3">
                            {friendRequestsCounter}
                          </CardTitle>
                          <p className="card-category">New Friend Requests</p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i
                      className="tim-icons icon-tap-02"
                      onClick={friendZoneHandler}
                    >
                      {" "}
                      move to Friend Zone{" "}
                    </i>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          )}

          {authCtx.isLoggedIn && (
            <Col lg="3" md="6">
              <Card
                style={{ height: "4cm", width: "7.5cm" }}
                className="card-stats"
              >
                {!finishedLoadingNotifications && <LoadingSpinner asOverlay />}

                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-danger">
                        <i className="tim-icons icon-alert-circle-exc" />
                      </div>
                    </Col>
                    {finishedLoadingNotifications && (
                      <Col xs="7">
                        <div className="numbers">
                          <p className="card-category">Notifications</p>
                          <CardTitle tag="h3">{notificationsCounter}</CardTitle>
                        </div>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            {authCtx.isLoggedIn ? (
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Course Table</CardTitle>
                </CardHeader>
                {isLoading && <LoadingSpinner asOverlay />}
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">From</th>
                        <th className="text-center">To</th>
                        <th className="text-center">Day</th>
                        <th className="text-center">Semester</th>
                        <th className="text-center">Lecturer</th>

                        <th className="text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {degreeCourses.map((course) => (
                        <tr>
                          <td className="text-center">{course.title}</td>
                          <td className="text-center">
                            {course.start_date.substring(11, 16)}
                          </td>
                          <td className="text-center">
                            {course.end_date.substring(11, 16)}
                          </td>
                          <td className="text-center">{course.day}</td>
                          <td className="text-center">{course.semester}</td>
                          <td className="text-center">{course.lecturer}</td>

                          <td className="text-center">
                            <Input
                              type="checkbox"
                              onChange={() => checkBoxHandler(course)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button color="success" onClick={addCoursesHandler}>
                    <i className="tim-icons icon-check-2" /> Add Courses to
                    Calendar
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <Card
                style={{ width: "20cm", marginLeft: "7cm", marginTop: "2cm" }}
              >
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
