import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './Login';
import CreateUser from './CreateUser';

const Auth = () => (
	<Switch>
		<Route path="/" exact component={Login} />
		<Route path="/register" exact component={CreateUser} />
		<Redirect to="/" />
	</Switch>
);

export default Auth;
