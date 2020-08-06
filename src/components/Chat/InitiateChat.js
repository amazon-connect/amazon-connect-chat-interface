// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "connect-core";

const Textarea = styled.textarea`
  margin: 0 5px;
  flex: 1;
  resize: none;
`;

const Input = styled.input`
  margin: 0 5px ;
  flex: 1;
`;

const Name = styled.div`

  min-width: 120px;
  text-align: left;
`;

const Label = styled.label`
 display: flex;
 text-align: left;
`;

const LabelVertical = styled.label`
 display: flex;
 flex-direction: column;
 text-align: left;
`;

const Wrapper = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const FormError = styled.div`
  padding: 5px;
  margin: 5px 5px 1px 5px;
  border: 1px solid red;
  background: #FFAAAA;
  font-size:  12px;
`;

export default class InitiateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initialMessage: "",
      secretKey: "",
      accessKey: "",
      contactFlowId: "",
      instanceId: "",
      region: "",
      stage: "",
      contactAttributes: "",
      contactAttributesError: null,
      sessionToken: ""
    };
    this.handleSecretKeyChange = this.handleSecretKeyChange.bind(this);
    this.handleAccessKeyChange = this.handleAccessKeyChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInstanceIdChange = this.handleInstanceIdChange.bind(this);
    this.handleContactFlowIdChange = this.handleContactFlowIdChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleStageChange = this.handleStageChange.bind(this);
    this.handleContactAttributesChange = this.handleContactAttributesChange.bind(this);
    this.handleSessionTokenChange = this.handleSessionTokenChange.bind(this);
  }

  handleSessionTokenChange(event){
    this.setState({ sessionToken: event.target.value });
  }

  handleSecretKeyChange(event) {
    this.setState({ secretKey: event.target.value });
  }

  handleAccessKeyChange(event) {
    this.setState({ accessKey: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ initialMessage: event.target.value });
  }

  handleInstanceIdChange(event) {
    this.setState({ instanceId: event.target.value });
  }

  handleContactFlowIdChange(event) {
    this.setState({ contactFlowId: event.target.value });
  }

  handleRegionChange(event) {
    this.setState({ region: event.target.value });
  }

  handleStageChange(event) {
    this.setState({ stage: event.target.value });
  }

  handleContactAttributesChange(event) {
    const valid = this.validateContactAttributes(event.target.value);
    this.setState({
      contactAttributes: event.target.value,
      contactAttributesError: valid ? null : 'Invalid contact attributes: Format must match {"key": "value", ...} with key and value being strings. Input will be ignored.'
    });
  }

  validateContactAttributes(value) {
    try {
      if (value) {
        const res = JSON.parse(value);
        return (
          Object.prototype.toString.call(res) === "[object Object]" &&
          Object.values(res).every(value => typeof value === "string")
        );
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    console.log("handleSubmit");
    console.log(this.state);
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <form name="what" onSubmit={this.handleSubmit}>
      <Label htmlFor="instanceId">
          <Name>Instance ID:</Name>
          <Input
            id="instanceId"
            name="instanceId"
            type="text"
            value={this.state.instanceId}
            onChange={this.handleInstanceIdChange}
          />
        </Label>
        <br />

         <Label htmlFor="directoty">
          <Name>ContactFlow ID:</Name>
          <Input
            id="contactFlowId"
            name="contactFlowId"
            type="text"
            value={this.state.contactFlowId}
            onChange={this.handleContactFlowIdChange}
          />
        </Label>
        <br />

        <Label htmlFor="secretx">
          <Name>SecretKey:</Name>
          <Input
            id="secretx"
            name="secretx"
            type="text"
            value={this.state.secretKey}
            onChange={this.handleSecretKeyChange}
          />
        </Label>
        <br />
        <Label htmlFor="accessx">
        <Name> AccessKey </Name>
          <Input
            id="accessx"
            name="accessx"
            type="text"
            value={this.state.accessKey}
            onChange={this.handleAccessKeyChange}
          />
        </Label>
        <br />

        <Label htmlFor="sessionToken">
        <Name> Session Token </Name>
          <Input
            id="sessionToken"
            name="sessionToken"
            type="text"
            value={this.state.sessionToken}
            onChange={this.handleSessionTokenChange}
          />
        </Label>
        <br />
        <Label htmlFor="regionx">
        <Name> Region </Name>
          <Input
            id="regionx"
            name="regionx"
            type="text"
            value={this.state.region}
            onChange={this.handleRegionChange}
          />
        </Label>
        <br />
        <Label htmlFor="stagex">
        <Name> Stage </Name>
          <Input
            id="stagex"
            name="stagex"
            type="text"
            value={this.state.stage}
            onChange={this.handleStageChange}
          />
        </Label>
        <br />
        <Label htmlFor="namex">
        <Name>Name: </Name>
          <Input
            id="namex"
            name="namex"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </Label>
        <br />
        <Label htmlFor="msgx">
        <Name>InitialMessage: </Name>
          <Input
            id="msgx"
            name="msgx"
            type="text"
            value={this.state.initialMessage}
            onChange={this.handleMessageChange}
          />
        </Label>
        <br />
        <LabelVertical htmlFor="attrsx">
          <Name>Contact Attributes: </Name>
          { this.state.contactAttributesError &&
            <FormError>{ this.state.contactAttributesError }</FormError>
          }
          <Textarea
            id="attrsx"
            name="attrsx"
            rows="4"
            placeholder="{&quot;key&quot;: &quot;value&quot;, ... }"
            value={this.state.contactAttributes}
            onChange={this.handleContactAttributesChange}
          />
        </LabelVertical>
        <Wrapper>
          <Button type="primary">
            Start Chat
          </Button>
        </Wrapper>
      </form>
    );
  }
}
