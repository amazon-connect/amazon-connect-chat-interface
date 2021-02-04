// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React, { useState } from 'react';
import PT from "prop-types";
import { Text } from "connect-core";
import { InteractiveMessageType } from "../../datamodel/Model";
import ListPicker from "./InteractiveMessages/ListPicker";
import Panel from "./InteractiveMessages/Panel";
import TimePicker from "./InteractiveMessages/TimePicker";
import styled from "styled-components";
 
//#region Styled Components
const MessageBody = styled.div`
  border: ${({ theme }) => theme.globals.baseBorder};
  border-radius: ${({ theme }) => theme.spacing.mini};
  
  button {
    cursor: pointer;
    border: ${({ theme }) => theme.globals.baseBorder};
  
    &:hover:enabled {
      color: #fff;
      background: ${({ theme }) => theme.color.primary};
    }
  }
`;
 
const Title = styled(Text)`
  font-weight: bold !important;
`;
 
const Subtitle = styled(Text)`
  color: ${({ theme }) => theme.globals.textSecondaryColor};
`;
 
const ElementImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
 
const TextSection = styled.div`
  padding: ${({ theme }) => theme.spacing.base};
  text-align: left;
`;
 
const ResponsesSection = styled.div`
  position: relative;
  white-space: pre-line;
  border-radius: ${({ theme }) => theme.spacing.mini};
`;
//#endregion Styled Components
 
InteractiveMessage.propTypes = {
  content: PT.object.isRequired,
  templateType: PT.string.isRequired,
  addMessage: PT.func.isRequired
};
 
export function InteractiveMessage({ content, templateType, addMessage }) {
  const [, setResponseSelected] = useState(false);
 
  function onAddMessage(data){
    addMessage(data);
    setResponseSelected(true);
  }
 
  function renderTemplate(){
    if (templateType === InteractiveMessageType.LIST_PICKER) {
      return <ListPicker content={content} addMessage={onAddMessage}/>
    } else if (templateType === InteractiveMessageType.PANEL) {
      return <Panel content={content} addMessage={onAddMessage}/>
    } else if (templateType === InteractiveMessageType.TIME_PICKER) {
      return <TimePicker content={content} addMessage={onAddMessage}/>
    }
  }
 
  return (
    <MessageBody>
      {renderTemplate()}
    </MessageBody>
  );
}
 
ReactiveImage.propTypes = {
  imageSrc: PT.string,
  imageDescription: PT.string
};
 
function ReactiveImage({ imageSrc, imageDescription, onImageLoad }) {
  return <ElementImage src={imageSrc} alt={imageDescription} onLoad={onImageLoad} onError={(err) => console.log("Failed to load image:", err)}/>;
}
 
export { ReactiveImage, TextSection, Title, Subtitle, ResponsesSection }