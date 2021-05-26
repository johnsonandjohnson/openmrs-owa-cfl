import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Breadcrumbs from './common/Breadcrumbs';
import _ from 'lodash';
import Header from './common/Header';
import ErrorBoundary from './common/ErrorBoundary';
import { connect } from 'react-redux';
import Unauthorized from './common/Unauthorized';
import { Spinner } from 'reactstrap';
import Customize from '@bit/soldevelo-cfl.omrs-components.customize';
import { routeConfig } from '../shared/constants/routes';

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
