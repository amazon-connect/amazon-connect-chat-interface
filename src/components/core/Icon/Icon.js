// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import PT from "prop-types";
import styled from "styled-components";
import { default_image } from "connect-images";

const defaultImageStyle = styled.img.attrs(props => ({
  src: props => props.src
}))`
  position: relative;
`;

const StyledImgSmall = styled(defaultImageStyle)`
  width: 20px;
  height: 20px;
`;

const StyledImgMedium = styled(defaultImageStyle)`
  width: 23px;
  height: 23px;
`;

const StyledImgLarge = styled(defaultImageStyle)`
  width: 30px;
  height: 30px;
`;

export default class Icon extends PureComponent {
  static propTypes = {
    type: PT.oneOf(["small", "medium", "large"]),
    withMargin: PT.bool,
    src: PT.string
  };

  static defaultProps = {
    type: "small",
    src: default_image
  };

  render() {
    const { type, ...rest } = this.props;

    switch (type) {
      case "small":
        return <StyledImgSmall {...rest} />;
      case "medium":
        return <StyledImgMedium {...rest} />;
      case "large":
        return <StyledImgLarge {...rest} />;
      default:
        return <StyledImgSmall {...rest} />;
    }
  }
}
