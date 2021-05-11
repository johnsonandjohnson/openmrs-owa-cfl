import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import FindPatient from './find-patient/FindPatient';
import Dashboard from './dashboard/Dashboard';
import Breadcrumbs from './common/Breadcrumbs';
import _ from 'lodash';
import Header from './common/Header';
import ErrorBoundary from './common/ErrorBoundary';
import RegisterPatient from './register/RegisterPatient';
import FindCaregiver from './find-caregiver/FindCaregiver';
import { connect } from 'react-redux';
import Unauthorized from './common/Unauthorized';
import { PRIVILEGES } from '../shared/constants/privilege';
import { Spinner } from 'reactstrap';
import Customize from '@bit/soldevelo-cfl.omrs-components.customize';
import RegisterCaregiver from './register/RegisterCaregiver';

export const routeConfig = [
  {
    path: '/find-patient',
    component: FindPatient,
    breadcrumb: 'findPatient.title',
    requiredPrivilege: PRIVILEGES.GET_PATIENTS
  },
  {
    path: '/find-caregiver',
    component: FindCaregiver,
    breadcrumb: 'findCaregiver.title',
    requiredPrivilege: PRIVILEGES.GET_PEOPLE
  },
  {
    path: '/register-patient',
    component: RegisterPatient,
    breadcrumb: 'registerPatient.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-patient/:id',
    component: RegisterPatient,
    breadcrumb: 'editPatient.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/register-caregiver',
    component: RegisterCaregiver,
    breadcrumb: 'registerCaregiver.title',
    requiredPrivilege: PRIVILEGES.ADD_PATIENTS
  },
  {
    path: '/edit-caregiver/:id',
    component: RegisterCaregiver,
    breadcrumb: 'editCaregiver.title',
    requiredPrivilege: PRIVILEGES.EDIT_PATIENTS
  },
  {
    path: '/',
    component: Dashboard,
    breadcrumb: 'home.title'
  }
];

export interface IRoutesProps extends StateProps, DispatchProps {}

class Routes extends React.Component<IRoutesProps> {
  renderComponent = route => {
    const { authenticated, privileges, loading } = this.props;
    if (route.requiredPrivilege) {
      if (loading) {
        return <Spinner />;
      } else if (!authenticated || !privileges.includes(route.requiredPrivilege)) {
        return <Unauthorized />;
      }
    }
    const Component = route.component;
    return <Component {...this.props} />;
  };

  render = () => (
    <Router>
      <Customize />
      <Header />
      <div className="content">
        <Breadcrumbs />
        <ErrorBoundary>
          <Switch>
            {_.map(routeConfig, route => (
              <Route path={route.path} key={route.path}>
                {this.renderComponent(route)}
              </Route>
            ))}
          </Switch>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

const mapStateToProps = ({ session }) => ({
  authenticated: session.authenticated,
  loading: session.loading,
  privileges: session.privileges
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
