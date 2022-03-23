import Calendar from "views/Calendar.js";
import Dashboard from "views/Dashboard.js";
import Register from "views/pages/Register.js";
import User from "views/pages/User.js";
import Login from "views/pages/Login.js";
import Friends from "views/pages/Friends";
import AboutUs from "views/components/about/AboutUs";
import FindMeeting from "views/pages/FindMeeting";
import MyCourses from "views/pages/MyCourses";

const routes = [
  {
    path: "/dashboard",
    name: "Main Page",
    icon: "tim-icons icon-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Pages",
    icon: "tim-icons icon-image-02",
    state: "pagesCollapse",
    views: [
      {
        path: "/login",
        name: "Login",
        mini: "L",
        component: Login,
        layout: "/auth",
      },
      {
        path: "/register",
        name: "Register",
        mini: "R",
        component: Register,
        layout: "/auth",
      },
      {
        path: "/user-profile",
        name: "User Profile",
        mini: "UP",
        component: User,
        layout: "/admin",
      },
      {
        path: "/Friends",
        name: "Friends Zone",
        mini: "FZ",
        component: Friends,
        layout: "/admin",
      },
      {
        path: "/FindMeeting",
        name: "Find A Meeting",
        mini: "FM",
        component: FindMeeting,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "tim-icons icon-calendar-60",
    component: Calendar,
    layout: "/admin",
  },
  {
    path: "/my-courses",
    name: "My Courses",
    icon: "tim-icons icon-wallet-43",
    component: MyCourses,
    layout: "/admin",
  },
  {
    path: "/aboutus",
    name: "About Us",
    icon: "tim-icons icon-headphones",
    component: AboutUs,
    layout: "/admin",
  },
];

export default routes;
