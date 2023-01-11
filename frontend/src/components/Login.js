import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import serializeForm from 'form-serialize';
import FormValidator from './FormValidator';
import API from '../api/api';
import { setAuthToken } from '../actions/auth';
import config from '../frigg.config';

// login component is a place for a user to enter a username and password
export class Login extends Component {
	constructor(props) {
		super(props);

		this.validator = new FormValidator([
			{
				field: 'username',
				method: 'isEmpty',
				validWhen: false,
				message: 'Username is required.',
			},
			{
				field: 'password',
				method: 'isEmpty',
				validWhen: false,
				message: 'Password is required.',
			},
			{
				field: 'password',
				method: 'isLength',
				args: [{ min: 4 }],
				validWhen: true,
				message: 'Password must be at least 4 characters',
			},
		]);

		this.state = {
			password: '',
			username: '',
			validation: this.validator.valid(),
			defaultUsername: 'demo@lefthook.com',
			defaultPassword: 'demo',
			submitted: false,
		};
	}

	componentDidMount() {
		const jwt = sessionStorage.getItem('jwt');
		if (jwt) {
			this.props.dispatch(setAuthToken(jwt)); // dispatch the auth token to the store
			this.props.history.push('/integrations');
		}
	}

	passwordMatch = (confirmation, state) => state.password === confirmation;

	// when form inputs change, this method handles validating them
	handleInputChange = (event) => {
		event.preventDefault();

		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	// call the api to login with the credentials
	login = async (username, password) => {
		// handle actual form submission here
		if (!username || !password) {
			return toast.error('Please fill in all the fields');
		}

		const api = new API();

		try {
			const data = await api.login(username, password);

			if (data.token) {
				const { token } = data;
				sessionStorage.setItem('jwt', token);
				this.props.dispatch(setAuthToken(token)); // dispatch the auth token to the store
				this.props.history.push('/dashboard');
			} else {
				return toast.error(`Failed to login using this base url: ${process.env.REACT_APP_API_BASE_URL}`);
			}
		} catch (e) {
			return toast.error('Login failed. Incorrect username or password');
		}
	};


	// form submission method, ultimately unpacks form values and calls login method
	handleFormSubmit = async (event) => {
		event.preventDefault();

		const values = serializeForm(event.target, { hash: true });

		const validation = this.validator.validate(this.state);
		this.setState({ validation });
		this.state.submitted = true;

		if (validation.isValid) {
			// TODO .. idk if this works
		}

		// attempt login
		await this.login(values.username, values.password);
	};

	handleDemoSubmit = async (event) => {
		event.preventDefault();

		const values = serializeForm(event.target, { hash: true });

		const validation = this.validator.validate(this.state);
		this.setState({ validation });
		this.state.submitted = true;

		await this.login(this.state.defaultUsername, this.state.defaultPassword);
	};
	createDemoUser = async () => {
		// handle actual form submission here

		const api = new API();

		try {
			const data = await api.createUser('demo@lefthook.com', 'demo');

			if (data.token) {
				return toast.success('New user created! please login.');
			} else {
				return toast.error('Creating a user failed. (its possible this user already exists...)');
			}
		} catch (e) {
			return toast.error('Login failed. Incorrect username or password');
		}
	};

	render() {
		const validation = this.validator.validate(this.state);

		return (
			<div className="h-screen relative flex flex-col justify-center items-center">
				<div className="bg-white rounded-lg shadow-xl p-12 w-[420px]">
					<h1 className="text-3xl font-semibold text-purple-600 inline-flex">
						<span className="ml-2">{config.appDisplayName}</span>
					</h1>

					<form className="my-10" onSubmit={this.handleDemoSubmit}>
						<h3 className="text-xl mb-4 text-l font-semibold text-gray-700">Login</h3>

						<div className="relative mb-2">
							<label className="block text-sm">
								<span className="text-gray-700">Email</span>
								<input
									data-testid="email-input"
									className="block w-full mt-1 text-sm form-input rounded-lg"
									defaultValue={this.state.defaultUsername}
									type="text"
									id="username"
									name="username"
									placeholder="Email"
									onChange={this.handleInputChange}
									disabled
								/>
							</label>
							<label className="block mt-4 text-sm">
								<span className="text-gray-700">Password</span>
								<input
									data-testid="password-input"
									className="block w-full mt-1 text-sm form-input rounded-lg"
									defaultValue={this.state.defaultPassword}
									type="password"
									name="password"
									placeholder="***************"
									onChange={this.handleInputChange}
									disabled
								/>
							</label>

							<button
								data-testid="login-button"
								type="submit"
								className="block w-full px-4 py-2 mt-8 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
							>
								<span className="inline-flex">
									{this.state.submitted && (
										<svg className="animate-spin h-5 w-5 text-white mr-3" fill="none" viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									)}
									Log in as demo user
								</span>
							</button>

							<p className="mt-8">
								<span className="text-sm font-medium text-purple-800 hover:underline cursor-pointer">
									Forgot your password?
								</span>
							</p>
							<p className="mt-1">
								{/* <Link className="text-sm font-medium text-purple-800 hover:underline cursor-pointer" to="/register">
									Create account
								</Link> */}
								<span className="text-sm font-medium text-purple-800 hover:underline cursor-pointer" onClick={this.createDemoUser}>
									Create account (demo user)
								</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

// this function defines which of the redux store items we want,
// and the return value returns them as props to our component
function mapStateToProps({ auth }) {
	return {
		authToken: auth.token,
	};
}

// connects this component to the redux store.
export default connect(mapStateToProps)(Login);
