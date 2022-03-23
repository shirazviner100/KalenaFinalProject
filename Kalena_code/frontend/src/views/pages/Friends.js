import React, { useContext, useCallback } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  FormGroup,
  CardTitle,
  Input,
  Row,
  Label,
} from "reactstrap";

import ReactBSAlert from "react-bootstrap-sweetalert";
import AuthContext from "views/store/auth-context";
import LoadingSpinner from "components/FormElements/LoadingSpinner";
import { useHttpClient } from "../../components/hooks/http-hook.js";

const Friends = () => {
  const [alert, setAlert] = React.useState(null);

  //enmail state value and vaidation
  const [email, setEmail] = React.useState("");
  const [emailState, setEmailState] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  //user and freind mutual event list
  const [mutualEvents, setMutualEvets] = React.useState([]);

  //boolean state to detect changes in mutual event list
  const [mutualEventsaAreTotallyRendered, setMutualEventsaAreTotallyRendered] =
    React.useState(false);
  //state to get the choosen friend index
  const [currentFriendIndex, setCurrentFriendIndex] = React.useState(-1);

  const { sendRequest } = useHttpClient();

  const authCtx = useContext(AuthContext);

  //pop up to exception
  const exceptionHandler = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Something did not work. <br />
        Please try again and check the values ​​you entered
      </ReactBSAlert>
    );
  };

  //Pop-up message to update the user that he entered an incorrect email
  const emailError = (err) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry..."
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        {err}
        <br />
      </ReactBSAlert>
    );
  };

  //The function requests from the database a list of recommendations for scheduling a meeting for all the
  //students that the user requested to add to the meeting
  const getCommonMeetings = async (id) => {
    const urlFriendsMutualEvents = `http://localhost:8080/friends/get_mutual_events/${authCtx.userId}/${id}`;

    try {
      const responseData = await sendRequest(
        urlFriendsMutualEvents,
        "GET",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );

      const mutualEvents = responseData.data;
      setMutualEvets(mutualEvents);
    } catch (err) {
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  //function change email state and email validation state
  const changeEmail = (email) => {
    if (verifyEmail(email.target.value)) {
      setEmailState("has-success");
    } else {
      setEmailState("has-danger");
    }
    setEmail(email.target.value);
  };

  //The function sends the membership request according to the email it received
  const addClickHandle = async () => {
    if (email !== "" && emailState === "has-success") {
      const urlSendFriendRequest = `http://localhost:8080/friends/send_friend_req/${authCtx.userId}/${email}`;

      try {
        setIsLoading(true);

        await sendRequest(urlSendFriendRequest, "PATCH", null, {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        });

        setEmail("");
        setIsLoading(false);
        addFriendSuccessAlert();
      } catch (err) {
        setIsLoading(false);
        emailError(err.message);
      }
    }
  };

  //pop up to add friend success
  const addFriendSuccessAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Well Done !!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The request has been sent successfully.
      </ReactBSAlert>
    );
  };

  //pop up to add friend success
  const approveSuccessAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Well Done !!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The request has been approved successfully.
      </ReactBSAlert>
    );
  };

  //pop up to add friend success
  const cancelSuccessAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Well Done !!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        The request has been cancel.
      </ReactBSAlert>
    );
  };

  // function that adds the current membership request from the list according to the index it receives
  const addClickHandler = async (index) => {
    const urlApproveFriendRequest = `http://localhost:8080/friends/approved_friend_req/${authCtx.userId}/${authCtx.friendsRequests[index].obj_id}`;

    try {
      setIsLoading(true);

      await sendRequest(urlApproveFriendRequest, "PATCH", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      });

      authCtx.updateFriends(authCtx.token, authCtx.userId);
      authCtx.updateFriendsRequests(authCtx.token, authCtx.userId);
      setIsLoading(false);
      approveSuccessAlert();
    } catch (err) {
      setIsLoading(false);
      exceptionHandler();
    }
  };

  const cancelClickHandler = async (index) => {
    const urlDeclineFriendRequest = `http://localhost:8080/friends/decline_friend_req/${authCtx.userId}/${authCtx.friendsRequests[index].obj_id}`;

    try {
      setIsLoading(true);

      await sendRequest(urlDeclineFriendRequest, "PATCH", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      });

      authCtx.updateFriendsRequests(authCtx.token, authCtx.userId);
      setIsLoading(false);
      cancelSuccessAlert();
    } catch (err) {
      setIsLoading(false);
      console.log(err.message || "Something went wrong, please try again.");
      exceptionHandler();
    }
  };

  const alertCommonMeeting = useCallback(
    (index) => {
      setAlert(
        <ReactBSAlert
          style={{
            display: "block",
            marginTop: "-100px",
            color: "black",
            width: "22cm",
          }}
          title={"Common Meetings With " + authCtx.friends[index].first_name}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="success"
          confirmBtnText="OK"
          btnSize=""
        >
          <br />
          <Row
            style={{
              margin: "auto",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <table
              style={{
                color: "balck",
                borderSpacing: "15px",
                borderCollapse: "separate",
              }}
            >
              <thead className="text-primary">
                <tr key="-1">
                  <th className="text-center">Title</th>
                  <th className="text-center">Start</th>
                  <th className="text-center">End</th>
                  <th className="text-center">Participants</th>
                  <th className="text-center">Repeat</th>
                </tr>
              </thead>
              <tbody>
                {mutualEvents.map((meeting, index) => (
                  <tr key={index}>
                    <td className="text-center">{meeting.title}</td>
                    <td className="text-center">
                      {new Date(meeting.start_date).toLocaleString("he-IL", {
                        timeZone: "Asia/Jerusalem",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        weekday: "short",
                      })}
                    </td>
                    <td className="text-center">
                      {new Date(meeting.end_date).toLocaleString("he-IL", {
                        timeZone: "Asia/Jerusalem",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        weekday: "short",
                      })}
                    </td>
                    <td className="text-center">
                      {meeting.participants.length}
                    </td>
                    <td className="text-center">{meeting.repeat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Row>
        </ReactBSAlert>
      );
    },
    [mutualEvents]
  );

  //The function displays the list of shared meetings with the selected member from the list
  const trClickHandler = (index) => {
    setCurrentFriendIndex(index);
    getCommonMeetings(authCtx.friends[index].obj_id);
  };

  //runs each time that mutual events changes.
  React.useEffect(() => {
    if (mutualEventsaAreTotallyRendered) {
      alertCommonMeeting(currentFriendIndex);
    }

    setMutualEventsaAreTotallyRendered(true);
  }, [mutualEvents]);

  //function remove friend from friends llist and DB
  const removeFriendHandler = async (index) => {
    const urlDeleteFriend = `http://localhost:8080/friends/delete_friend/${authCtx.userId}/${authCtx.friends[index].obj_id}`;

    try {
      setIsLoading(true);

      await sendRequest(urlDeleteFriend, "DELETE", null, {
        Authorization: "Bearer " + authCtx.token,
      });

      authCtx.updateFriends(authCtx.token, authCtx.userId);
      authCtx.updateFriendsRequests(authCtx.token, authCtx.userId);
      setIsLoading(false);
      deleteFriendAlert();
    } catch (err) {
      setIsLoading(false);
      exceptionHandler();
    }
  };

  const deleteFriendAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Mission Accomplished !!!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        Friend has been deleted.
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setIsLoading(false);
    setAlert(null);
  };

  return (
    <>
      {alert}
      <div className="content">
        {authCtx.isLoggedIn ? (
          <div>
            <Card>
              <CardHeader>
                <h5 className="title">Friends Zone:</h5>
              </CardHeader>
              {isLoading && <LoadingSpinner asOverlay />}
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">First Name</th>
                      <th className="text-center">Last Name</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Degree</th>
                      <th className="text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody key="tbody">
                    {authCtx.friends.map((friend, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => trClickHandler(index)}
                          className="text-center"
                        >
                          {friend.first_name}
                        </td>
                        <td
                          onClick={() => trClickHandler(index)}
                          className="text-center"
                        >
                          {friend.last_name}
                        </td>
                        <td
                          onClick={() => trClickHandler(index)}
                          className="text-center"
                        >
                          {friend.email}
                        </td>
                        <td
                          onClick={() => trClickHandler(index)}
                          className="text-center"
                        >
                          {friend.degree}
                        </td>
                        <td className="text-center">
                          <Button
                            color="daner"
                            onClick={() => removeFriendHandler(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="title">Add Friends:</h5>
              </CardHeader>
              {isLoading && <LoadingSpinner asOverlay />}
              <CardBody>
                <Label>Email Address:</Label>
                <FormGroup className={emailState}>
                  <div>
                    <Input
                      value={email}
                      name="email"
                      type="text"
                      onChange={(e) => changeEmail(e)}
                    />
                    {emailState === "has-danger" ? (
                      <label style={{ color: "red" }} className="error">
                        Please enter a valid email address.
                      </label>
                    ) : null}
                  </div>
                </FormGroup>
                <Button onClick={addClickHandle} color="info">
                  Add
                </Button>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h5 className="title">Friends Requests:</h5>
              </CardHeader>
              {isLoading && <LoadingSpinner asOverlay />}
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">First Name</th>
                      <th className="text-center">Last Name</th>
                      <th className="text-center">Add</th>
                      <th className="text-center">Cancel</th>
                    </tr>
                  </thead>
                  <tbody key="tbody">
                    {authCtx.friendsRequests.map((friend, index) => (
                      <tr key={index}>
                        <td className="text-center">{friend.first_name}</td>
                        <td className="text-center">{friend.last_name}</td>
                        <td className="text-center">
                          <Button
                            onClick={() => addClickHandler(index)}
                            color="info"
                          >
                            Add
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button
                            onClick={() => cancelClickHandler(index)}
                            color="danger"
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
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
    </>
  );
};

export default Friends;
