import React from "react";
import { Switch, Route, HashRouter as Router } from "react-router-dom";
import FindPatient from "./find-patient/FindPatient";
import Dashboard from "./dashboard/Dashboard";
import Breadcrumbs from "./common/Breadcrumbs";
import _ from "lodash";
import Header from "./common/Header";
import ErrorBoundary from "./common/ErrorBoundary";
import RegisterPatient from "./register-patient/RegisterPatient";

export const routeConfig = [
  {
    path: "/find-patient",
    component: <FindPatient />,
    breadcrumb: "findPatient.title",
  },
  {
    path: "/register-patient",
    component: <RegisterPatient />,
    breadcrumb: "registerPatient.title",
  },
  {
    path: "/",
    component: <Dashboard />,
    breadcrumb: "common.home",
  },
];

const Routes = () => (
  <Router>
    <Header />
    <div className="content">
      <Breadcrumbs />
      <ErrorBoundary>
        <Switch>
          {_.map(routeConfig, (route) => (
            <Route path={route.path} key={route.path}>
              {route.component}
            </Route>
          ))}
        </Switch>
      </ErrorBoundary>
    </div>
  </Router>
);

export default Routes;
