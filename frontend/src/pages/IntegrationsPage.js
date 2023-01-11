import { React, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { List } from '../components/Integration';

function IntegrationsPage(props) {
	const [integrationType, setIntegrationType] = useState('Recently added');

	const categories = [
		{ _id: 1, slug: 'recently-added', name: 'Recently added' },
		{ _id: 2, slug: 'marketing', name: 'Marketing' },
		{ _id: 3, slug: 'sales-and-crm', name: 'Sales & CRM' },
		{ _id: 4, slug: 'commerce', name: 'Commerce' },
		{ _id: 5, slug: 'social', name: 'Social' },
		{ _id: 6, slug: 'productivity', name: 'Productivity' },
		{ _id: 7, slug: 'finance', name: 'Finance' },
		{ _id: 8, slug: 'installed', name: 'Installed' },
	];

	useEffect(() => {
		const jwt = props.authToken || sessionStorage.getItem('jwt');
		if (!jwt) {
			props.history.push('/logout');
		}
	}, []);

	const filterIntegration = (type) => {
		setIntegrationType(type);
	};

	return (
		<main className="h-full pb-16 overflow-y-auto">
			<div className="container px-6 mx-auto grid">
				<h2 className="my-6 text-2xl font-semibold text-gray-700">Integrations</h2>
				<div className="grid mb-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					<ul className="col-span-1 pl-10 xs:inline-flex">
						{categories.map((category) => (
							<li
								key={category._id}
								className="mb-4 text-lg font-semibold text-gray-600 cursor-pointer mr-2 sm:inline md:block"
								onClick={() => {
									filterIntegration(category.name);
								}}
							>
								<span className={integrationType == category.name ? 'border-b-4 border-purple-600' : ''}>
									{category.name}
								</span>
							</li>
						))}
					</ul>
					<div className="grid gap-6 lg:col-span-1 lg:grid-cols-1 xl:col-span-2 xl:grid-cols-2 2xl:col-span-3 2xl:grid-cols-3 2xl:grid-rows-6">
						<List integrationType={integrationType} />
					</div>
				</div>
			</div>
		</main>
	);
}

function mapStateToProps({ auth }) {
	return {
		authToken: auth.token,
	};
}

export default connect(mapStateToProps)(IntegrationsPage);
