import React from 'react';
import Button from './';

describe('<Button />', () => {
  it('should fire callback when onclick is provided and clicked', () => {
    const onclickEvent = jest.fn();
    const wrapper = shallow(<Button onClick={onclickEvent}>Click Me</Button>);

    expect(onclickEvent).toHaveBeenCalledTimes(0);
    wrapper.simulate('click');
    expect(onclickEvent).toHaveBeenCalledTimes(1);
  });

  describe('styles should match snapshots: ', () => {
    test('default', () => {
      const tree = createTree(<Button>Default</Button>);

      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('background', 'linear-gradient(#FFFFFF,#FFFFFF 80%,#FFFFFF)');
      expect(tree).toHaveStyleRule('padding-top', '0.45rem');
      expect(tree).toHaveStyleRule('padding-bottom', '0.45rem');
    });

    test('primary', () => {
      const tree = createTree(<Button type="primary">Primary</Button>);

      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('background', 'linear-gradient(#538000,#538000 80%,#649a00)');
    });

    test('secondary', () => {
      const tree = createTree(<Button type="primary">Secondary</Button>);

      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('background', 'linear-gradient(#538000,#538000 80%,#649a00)');
    });

    test('tertiary', () => {
      const tree = createTree(<Button type="tertiary">Action</Button>);

      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('background', 'linear-gradient(#329AD6,#329AD6 80%,#47a4da)');
    });

    test('small', () => {
      const tree = createTree(<Button small>Small</Button>);

      expect(tree).toMatchSnapshot();
      expect(tree).toHaveStyleRule('padding-top', '4px');
      expect(tree).toHaveStyleRule('padding-bottom', '4px');
    });

    test('disabled', () => {
      const tree = createTree(<Button disabled>Disabled</Button>);

      expect(tree).toMatchSnapshot();
    });
  });
});