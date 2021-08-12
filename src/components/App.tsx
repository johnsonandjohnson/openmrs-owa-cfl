import React from 'react';
import './App.scss';
import Routes from './Routes';
import { connect } from 'react-redux';
import { getSession } from '../redux/reducers/session';
import { TinyButton as ScrollUpButton } from 'react-scroll-up-button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-3/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../assets/css/font-awesome-3.0.2.min.css';
import { getApps } from '../redux/reducers/apps';
import '@openmrs/style-referenceapplication/lib/referenceapplication.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export interface IAppProps extends StateProps, DispatchProps {}

class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getApps();
  }

  render() {
    return (
      <div id="app" className="app">
        <Routes />
        <ScrollUpButton />
      </div>
    );
  }
}

const mapStateToProps = ({ session }) => ({
  session: session.session
});

const mapDispatchToProps = { getSession, getApps };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
