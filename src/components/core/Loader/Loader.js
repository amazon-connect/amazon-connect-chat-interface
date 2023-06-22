// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, {PureComponent} from "react"
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";

export default class Loader extends PureComponent {
  render() {
    return (
      <span className="loader">
        <ClipLoader size={15} color={this.props.color || "#fff"} {...this.props}/>
      </span>
    )
  }
}

export class TypingLoader extends PureComponent {
  render() {
    return (
      <BeatLoader size={5} {...this.props} />
    )
  }
}
