module.exports = {
	appDisplayName: 'Create Frigg App Template Site',
	appVersion: '1.0.0' || require('../package.json').version,
	componentLayout: 'default-horizontal',
	componentFilter: {
		active: true,
		allTab: false,
		recentlyAddedTab: true,
		installedTab: true,
		categories: ['Marketing', 'Sales & CRM', 'Commerce', 'Social', 'Productivity', 'Finance'],
	}
};
