import React, { useContext } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  UncontrolledTooltip,
  Label,
} from "reactstrap";

import { Link, useHistory } from "react-router-dom";
import AuthContext from "views/store/auth-context";

var today = new Date();
var y = today.getFullYear();
var m = today.getMonth();
var d = today.getDate();

const AdminNavbar = (props) => {
  //states to page design
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");

  //states to user data
  const [dayEvents, setDayEvents] = React.useState([]);

  const [alert, setAlert] = React.useState(null);

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const history = useHistory();

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });

  //changing every time that userEvents state change
  React.useEffect(() => {
    if (authCtx.userEvents.length > 0) updateEvents();
  }, [authCtx.userEvents]);

  const hideAlert = () => {
    setAlert(null);
  };

  // function that filters the events by today's date
  const updateEvents = () => {
    const allFilteredEvents = authCtx.userEvents.filter(
      (event) =>
        new Date(event.start_date).getFullYear() === y &&
        new Date(event.start_date).getMonth() === m &&
        new Date(event.start_date).getDate() === d
    );
    setDayEvents(allFilteredEvents);
  };

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
  };

  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };

  // function that handles the notification where user's answer is "Yes"
  const handleAddMeeting = (current) => {
    const urlUpdateNotifications = `http://localhost:8080/event/response_to_invitation/${authCtx.userId}/${current.obj_id}/Yes`;
    authCtx.userMeetingAnswer(urlUpdateNotifications, current, true);

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Congratulations !!!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Meeting was added to your calendar!
      </ReactBSAlert>
    );
  };

  // function that handles the notification where user's answer is "No"
  const handleCancelMeeting = (current) => {
    const urlUpdateNotifications = `http://localhost:8080/event/response_to_invitation/${authCtx.userId}/${current.obj_id}/No`;
    authCtx.userMeetingAnswer(urlUpdateNotifications, current, false);
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Meeting has been deleted"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="OK"
        btnSize=""
      >
        The meeting has been removed from your meeting request list
      </ReactBSAlert>
    );
  };

  // function that handles the notification
  const handleNavBarClicked = (meeting) => {
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
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title={"New meeting request - " + meeting.title}
        onConfirm={hideAlert}
        onCancel={hideAlert}
        closeBtnStyle={closeButtonStyle}
        customButtons={
          <>
            <Button color="danger" onClick={() => handleCancelMeeting(meeting)}>
              No, delete it!
            </Button>
            <Button color="success" onClick={() => handleAddMeeting(meeting)}>
              Yes, add it!
            </Button>
          </>
        }
        showCloseButton
        allowEscape
        btnSize=""
      >
        <br />
        <div className="content">
          <Label style={{ color: "black" }} tag="h4">
            You have received a new request for a meeting. <br /> <br /> Meeting
            Details:
          </Label>
          <Label style={{ color: "black" }}>
            The event was created by : {meeting.creator}
          </Label>
          <br />
          {meeting.invitees.length > 0 ? (
            <Label style={{ color: "black" }}>
              The students who have been invited to the event are :
            </Label>
          ) : (
            ""
          )}
          <br />
          {meeting.invitees.length > 0
            ? meeting.invitees.map((invite) => (
                <div>
                  <Label style={{ color: "black" }}>{invite}</Label>
                  <br />
                </div>
              ))
            : ""}
          <br />
          <Label style={{ color: "black" }}>
            Starts:{" "}
            {new Date(meeting.start_date).toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <br />
            Ends:{" "}
            {new Date(meeting.end_date).toLocaleString("he-IL", {
              timeZone: "Asia/Jerusalem",
              day: "2-digit",
              month: "short",
              year: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <br />
          </Label>
          {meeting.description ? (
            <div>
              <Label>Description: {meeting.description} </Label>
            </div>
          ) : null}
          {meeting.location ? (
            <div>
              {" "}
              <Label>At: {meeting.location} </Label>{" "}
            </div>
          ) : null}

          <div>
            <Label>Repeat: {meeting.repeat}</Label>
          </div>
        </div>
      </ReactBSAlert>
    );
  };

  const handleEventsBarClicked = () => {
    history.push("/admin/calendar");
  };

  const handleFriendRequestsClick = () => {
    history.push("/admin/Friends");
  };

  // this function meant to redirect into the register page by the "Sign Up" button
  const registerPageHandler = () => {
    const path = "/auth/register";
    history.push(path);
  };

  // this function meant to redirect into the register page by the "Sign In" button
  const loginPageHandler = () => {
    const path = "/auth/login";
    history.push(path);
  };

  // function that handles with the logout
  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <>
      {alert}
      <Navbar
        className={classNames("navbar-absolute", {
          [color]: props.location.pathname.indexOf("full-screen-map") === -1,
        })}
        expand="lg"
      >
        <Container fluid>
          <div className="navbar-wrapper">
            {isLoggedIn && (
              <div className="navbar-minimize d-inline">
                <Button
                  className="minimize-sidebar btn-just-icon"
                  color="link"
                  id="tooltip209599"
                  onClick={props.handleMiniClick}
                >
                  <i className="tim-icons icon-align-center visible-on-sidebar-regular" />
                  <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini" />
                </Button>
                <UncontrolledTooltip
                  delay={0}
                  target="tooltip209599"
                  placement="right"
                >
                  Sidebar toggle
                </UncontrolledTooltip>
              </div>
            )}
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={props.toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="#kalena" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-alert-circle-exc" />
                  <p className="d-lg-none">Notifications</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {isLoggedIn &&
                    authCtx.userNotification.length > 0 &&
                    authCtx.userNotification.map((notification) => (
                      <NavLink
                        onClick={() => handleNavBarClicked(notification)}
                        tag="li"
                      >
                        <DropdownItem className="nav-item">
                          {notification.title
                            ? notification.title
                            : "New invitation"}
                        </DropdownItem>
                      </NavLink>
                    ))}
                  {isLoggedIn && authCtx.userNotification.length === 0 && (
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        No notifications
                      </DropdownItem>
                    </NavLink>
                  )}

                  {!isLoggedIn && (
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        In order to see your invitations you must log in
                      </DropdownItem>
                    </NavLink>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-time-alarm" />
                  <p className="d-lg-none">Events</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {isLoggedIn && dayEvents.length === 0 && (
                    <NavLink onClick={() => handleEventsBarClicked()} tag="li">
                      <DropdownItem className="nav-item">
                        No events today Click to move to calendar
                      </DropdownItem>
                    </NavLink>
                  )}
                  {!isLoggedIn && (
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        In order to see your events you must log in
                      </DropdownItem>
                    </NavLink>
                  )}
                  {isLoggedIn &&
                    dayEvents.length !== 0 &&
                    dayEvents.map((event) => (
                      <NavLink
                        onClick={() => handleEventsBarClicked()}
                        tag="li"
                      >
                        <DropdownItem className="nav-item">
                          {event.title}
                        </DropdownItem>
                      </NavLink>
                    ))}
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                >
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <i className="tim-icons icon-bell-55" />
                  <p className="d-lg-none">Friends Requests</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {isLoggedIn && authCtx.friendsRequests.length === 0 && (
                    <NavLink
                      onClick={() => handleFriendRequestsClick()}
                      tag="li"
                    >
                      <DropdownItem className="nav-item">
                        No friends requests
                      </DropdownItem>
                    </NavLink>
                  )}
                  {!isLoggedIn && authCtx.friendsRequests.length === 0 && (
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        In order to your friends requests you must log in
                      </DropdownItem>
                    </NavLink>
                  )}
                  {isLoggedIn &&
                    authCtx.friendsRequests.length !== 0 &&
                    authCtx.friendsRequests.map((friend) => (
                      <NavLink
                        onClick={() => handleFriendRequestsClick()}
                        tag="li"
                      >
                        <DropdownItem className="nav-item">
                          {friend.email}
                        </DropdownItem>
                      </NavLink>
                    ))}
                </DropdownMenu>
              </UncontrolledDropdown>

              {isLoggedIn && (
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="photo">
                      <img
                        alt="..."
                        src={require("assets/img/kal.png").default}
                      />
                    </div>

                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        tag={Link}
                        to="/admin/user-profile"
                      >
                        Profile
                      </DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={logoutHandler}
                        tag={Link}
                        to="/admin/dashboard"
                      >
                        Log out
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              {!isLoggedIn && (
                <UncontrolledDropdown nav>
                  <Button
                    className="btn-simple"
                    color="primary"
                    onClick={registerPageHandler}
                  >
                    Sign Up
                  </Button>
                </UncontrolledDropdown>
              )}
              {!isLoggedIn && (
                <UncontrolledDropdown nav>
                  <Button color="primary" onClick={loginPageHandler}>
                    Login
                  </Button>
                </UncontrolledDropdown>
              )}

              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
