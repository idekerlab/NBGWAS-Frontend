import React from 'react';
import { shallow } from 'enzyme';

import App from '.././App';
import WarningBar from '../components/WarningBar';
import NavBar from '../components/NavBar';
import Content from '../containers/Content';

it('renders without crashing', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.contains(<WarningBar />)).toEqual(true);
  expect(wrapper.contains(<NavBar />)).toEqual(true);
  expect(wrapper.contains(<Content />)).toEqual(true);
});

