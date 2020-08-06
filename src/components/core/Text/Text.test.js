import React from 'react';
import Text from './';

describe('<Text />', () => {
  describe('styles should match snapshots: ', () => {
    test('h1', () => {
      const tree = createTree(<Text type="h1">H1</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('h2', () => {
      const tree = createTree(<Text type="h2">H2</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('h3', () => {
      const tree = createTree(<Text type="h3">H3</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('h4', () => {
      const tree = createTree(<Text type="h4">H4</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('h5', () => {
      const tree = createTree(<Text type="h5">H5</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('h6', () => {
      const tree = createTree(<Text type="h6">H6</Text>);
      expect(tree).toMatchSnapshot();
    });

    test('p', () => {
      const tree = createTree(<Text type="p">P</Text>);
      expect(tree).toMatchSnapshot();
    });
  });

  it('can style a tag as something else', () => {
    const tree = createTree(<Text type="h1" styleAs="h2">H1 tag that looks like H2</Text>);
    expect(tree).toMatchSnapshot();
    expect(tree).toHaveStyleRule('font-size', '21px');
  });

  it('can style inline', () => {
    const tree = createTree(<Text inline>I am inline</Text>);
    expect(tree).toMatchSnapshot();
    expect(tree).toHaveStyleRule('display', 'inline');
  });
});