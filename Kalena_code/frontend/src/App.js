import React, { Suspense } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";
import "assets/demo/demo.css";
import LoadingSpinner from "components/FormElements/LoadingSpinner";

// lazy loading - loading in chunks
const AuthLayout = React.lazy(() => import("layouts/Auth/Auth.js"));
const AdminLayout = React.lazy(() => import("layouts/Admin/Admin.js"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="centered">
          <LoadingSpinner asOverlay />
        </div>
      }
    >
      <Switch>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Suspense>
  );
}

export default App;
