/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import DoneButton, { StyledDoneButton } from './DoneButton';

export const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

export const mockReduxStore = {
  wrappingComponent: Provider,
  wrappingComponentProps: { store }
};

describe('DoneButton', function() {
  it('should render without crashing', function() {
    const wrapper = mount(<DoneButton />, mockReduxStore);
    expect(wrapper).to.be.ok;
  });

  describe('when props.completed is true', function() {
    it('should not render', function () {
      const wrapper = mount(<DoneButton completed={true} />, mockReduxStore);
      expect(wrapper.html()).to.equal('');
    });
  });

  it('should call props.onClick for the onClick event', function() {
    const onClickSpy = sinon.spy();
    const wrapper = mount(<DoneButton onClick={onClickSpy} />, mockReduxStore);
    wrapper.find('button').simulate('click');
    expect(onClickSpy.calledOnce).to.be.true;
  });

  describe('when props.completed is false', function() {
    it('should render a ThemeProvider', function() {
      const wrapper = mount(<DoneButton />, mockReduxStore);
      expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
    });

    it('should render a StyledDoneButton', function() {
      const wrapper = mount(<DoneButton />, mockReduxStore);
      expect(wrapper.find(StyledDoneButton)).to.have.lengthOf(1);
    });
  });

  describe('props.goldStandardMode', function() {
    it('should not render a star icon if props.goldStandardMode is false', function() {
      const wrapper = mount(<DoneButton />, mockReduxStore);
      expect(wrapper.find('i.fa-star')).to.have.lengthOf(0);
    });

    it('should render a star icon if props.goldStandardMode is true', function () {
      const wrapper = mount(<DoneButton goldStandardMode={true} />, mockReduxStore);
      expect(wrapper.find('i.fa-star')).to.have.lengthOf(1);
    });
  });

  describe('props.demoMode', function () {
    it('should not render a trash icon if props.demoMode is false', function () {
      const wrapper = mount(<DoneButton />, mockReduxStore);
      expect(wrapper.find('i.fa-trash')).to.have.lengthOf(0);
    });

    it('should render a trash icon if props.demoMode is true', function () {
      const wrapper = mount(<DoneButton demoMode={true} />, mockReduxStore);
      expect(wrapper.find('i.fa-trash')).to.have.lengthOf(1);
    });
  });
});
