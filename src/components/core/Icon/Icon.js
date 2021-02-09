// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import PT from 'prop-types';
import styled from 'styled-components';
import { default_image } from 'connect-images';
import { SpriteSymbol } from 'connect-prop-types';
import { FlexVerticalCenterContainer } from 'connect-theme/Helpers';

const SVGComponent = function({ src, alt }) {
  const svgConfig = {
    role: 'img',
    width: '100%',
    height: '100%',
    'aria-label': alt !== '' ? alt : undefined,
    'aria-hidden': alt === ''
  };
  const SVG = src;
  return <SVG {...svgConfig} />
};

const ImgComponent = styled.img``;

const SIZE_TYPE = {
  mini: { w: '13px', h: '13px' },
  small: { w: '20px', h: '20px' },
  medium: { w: '23px', h: '23px' },
  large: { w: '30px', h: '30px' }
};

Icon.propTypes = {
  type: PT.oneOf(['mini', 'small', 'medium', 'large']),
  withMargin: PT.bool,
  src: PT.oneOfType([SpriteSymbol, PT.string]),
  alt: PT.string
};

Icon.defaultProps = {
  type: 'small',
  src: default_image,
  alt: ''
};

const IconWrapper = styled(FlexVerticalCenterContainer)`
  ${({ size }) => `width: ${size.w}; height: ${size.h};`};
  
  img{
    width: 100%;
  }
`;

function Icon({ type, src, ...rest }) {
  const IconComponent = typeof src === 'string' ? ImgComponent : SVGComponent;
  return (
      <IconWrapper type={type} size={SIZE_TYPE[type]}>
        <IconComponent src={src} {...rest} />
      </IconWrapper>
  );
}

export { Icon, IconWrapper };