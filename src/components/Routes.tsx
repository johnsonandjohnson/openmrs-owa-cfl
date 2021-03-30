import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import FindPatient from "./find-patient/FindPatient";
import Dashboard from "./dashboard/Dashboard";
import Breadcrumbs from "./common/Breadcrumbs";
import _ from "lodash";
import Header from "./common/Header";
import ErrorBoundary from "./common/ErrorBoundary";
import RegisterPatient from "./register-patient/RegisterPatient";
import FindCaregiver from "./find-caregiver/FindCaregiver";

export const routeConfig = [
  {
    path: "/find-patient",
    component: FindPatient,
    breadcrumb: "findPatient.title",
  },
  {
    path: "/find-caregiver",
    component: FindCaregiver,
    breadcrumb: "findCaregiver.title",
  },
  {
    path: "/register-patient",
    component: RegisterPatient,
    breadcrumb: "registerPatient.title",
  },
  {
    path: "/edit-patient/:id",
    // @ts-ignore
    component: RegisterPatient,
    breadcrumb: "editPatient.title",
  },
  {
    path: "/",
    component: Dashboard,
    breadcrumb: "home.title",
  },
];

const Routes = ({ ...props }) => (
  <Router>
    <Header />
    <div className="content">
      <Breadcrumbs />
      <ErrorBoundary>
        <Switch>
          {_.map(routeConfig, (route) => {
            const Component = route.component;
            return (
              <Route path={route.path} key={route.path}>
                <Component {...props} />
              </Route>
            );
          })}
        </Switch>
      </ErrorBoundary>
    </div>
  </Router>
);

export default Routes;
