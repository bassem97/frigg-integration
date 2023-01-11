import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Data from './components/Data';
import Logout from './components/Logout';
import AuthRedirect from './components/AuthRedirect';
import IntegrationsPage from './pages/IntegrationsPage';
import SettingsPage from './pages/SettingsPage';

const AppRouter = (props) => {
	return (
		<>
			<Sidebar />
			<div className="flex flex-col flex-1">
				<Navbar />
				<Switch>
					<Route path="/integrations" exact component={IntegrationsPage} />
					<Route path="/settings" exact component={SettingsPage} />
					<Route path="/data/:integrationId" exact component={Data} />
					<Route path="/redirect/:app" exact component={AuthRedirect} />
					<Route path="/logout" exact component={Logout} />
					<Redirect to="/integrations" />
				</Switch>
			</div>
		</>
	);
};

export default withRouter(AppRouter);
