import { render, screen, cleanup } from '@testing-library/react';
// import renderer from 'react-test-renderer';
import * as Integration from '../components/Integration';

describe("Integration test", ()=>{
it.only('pending migration from mocha/chai to jest', ()=>{
	expect(1+2).toBe(4)
})

afterEach(() => {
	cleanup();
});

test('should render horizontal integration', () => {
	const data = {
		name: 'Horizontal',
		description: 'Test Description',
		category: 'Marketing',
		icon: 'https://via.placeholder.com/400', // replace this to work offline
		type: '',
	};
	const key = `combined-integration-${data.type}`;
	const handleInstall = [];

	render(<Integration.Horizontal data={data} key={key} handleInstall={handleInstall} />);
	const element = screen.getByTestId('integration-horizontal');
	expect(element).toBeInTheDocument();
	expect(element).toHaveTextContent('Horizontal');
});

test('should render vertical integration', () => {
	const data = {
		name: 'Vertical',
		description: 'Test Name',
		category: 'Marketing',
		icon: 'https://via.placeholder.com/400', // replace this to work offline
		type: '',
	};
	const key = `combined-integration-${data.type}`;
	const handleInstall = [];

	render(<Integration.Vertical data={data} key={key} handleInstall={handleInstall} />);
	const element = screen.getByTestId('integration-vertical');
	expect(element).toBeInTheDocument();
	expect(element).toHaveTextContent('Vertical');
});

test('should render horizontal skeleton', () => {
	const layout = 'default-horizontal';
	render(<Integration.Skeleton layout={layout} />);
	const element = screen.getByTestId('skeleton-horizontal');
	expect(element).toBeInTheDocument();
});

test('should render vertical skeleton', () => {
	const layout = 'default-vertical';
	render(<Integration.Skeleton layout={layout} />);
	const element = screen.getByTestId('skeleton-vertical');
	expect(element).toBeInTheDocument();
});

test('matches snapshot: Integration.test.js', () => {
	const data = {
		name: 'Horizontal',
		description: 'Test Description',
		category: 'Marketing',
		icon: 'https://via.placeholder.com/400', // replace this to work offline
		type: '',
	};
	const key = `combined-integration-${data.type}`;
	const handleInstall = [];

	const tree = renderer.create(<Integration.Horizontal data={data} key={key} handleInstall={handleInstall} />).toJSON();
	expect(tree).toMatchSnapshot();
});

	})