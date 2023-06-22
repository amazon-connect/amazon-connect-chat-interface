// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useLayoutEffect } from 'react';
import PT from "prop-types";
import { Text } from "connect-core";
import { InteractiveMessageType } from "../../datamodel/Model";
import ListPicker from "./InteractiveMessages/ListPicker";
import Panel from "./InteractiveMessages/Panel";
import TimePicker from "./InteractiveMessages/TimePicker";
import QuickReply from "./InteractiveMessages/QuickReply";
import Carousel from "./InteractiveMessages/Carousel";
import { RichMessageRenderer } from "../../RichMessageComponents";
import styled from "styled-components";

//#region Styled Components
const MessageBody = styled.div`
  border: ${({ theme }) => theme.globals.baseBorder};
  border-radius: ${({ theme }) => theme.spacing.mini};

  ${props => props.addChildBackgroundStyles ? `
    background: ${props.theme.chatTranscriptor.incomingMsgBg}
    padding: 14px;
  ` : ""}

  ${props => props.isCarouselElem ? `
    position: relative;
    max-width: 350px;
    min-width: 225px;
    scroll-snap-align: start;
    background: ${props.theme.chatTranscriptor.incomingMsgBg}
    display: flex;
    flex-direction: column;
  ` : ""}

  ${props => props.applySpeechBubbleCaret ? `
    position: relative;

    &:after {
      display: block;
      content: " ";
      position: absolute;
      left: -6px;
      bottom: 4px;
      border-radius: 2px;
      border-left: 10px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 9px solid ${props.theme.chatTranscriptor.incomingMsgBg};
    }
  ` : ""}

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

  ${props => props.hasNestedSVG ? `
    align-items: center;
    display: flex;
    justify-content: center;
  ` : ""}
`;

const ResponsesSection = styled.div`
  position: relative;
  white-space: pre-line;
  border-radius: ${({ theme }) => theme.spacing.mini};

  ${props => props.isCarouselElem ? `
    margin-top: auto;
    flex: none;
  ` : ""}
`;
const PickerElementLink = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: none;
  border: ${({ theme }) => theme.globals.baseBorder};
  background: ${({ theme }) => theme.palette.white};
  white-space: pre-line;
  padding-right: ${({ theme }) => theme.spacing.small};
  padding-left: ${({ theme }) => theme.spacing.small};
  padding-top: ${({ theme }) => theme.button.normal.padding};
  padding-bottom: ${({ theme }) => theme.button.normal.padding};
  font-size: ${({ theme }) => theme.button.normal.fontSize};
  line-height: 1.465;
  text-decoration: none;

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.spacing.mini};
    border-bottom-right-radius: ${({ theme }) => theme.spacing.mini};
    margin-bottom: 0;
  }

  a: {
    text-decoration: none !important;
    font-weight: bold !important;
  }

  svg: {
    color: ${({ theme }) => theme.globals.textSecondaryColor};
    margin: 0 ${({ theme }) => theme.spacing.micro};
  }
`;
const PickerOptionTitle = styled(Text)`
  font-weight: bold;

  a {
    text-decoration: none;
  }

  ${(props) => props.hasNestedSVG ? `
    align-items: center;
    display: flex;
    justify-content: center;
  ` : ""}
`;
//#endregion Styled Components

InteractiveMessage.propTypes = {
  content: PT.object.isRequired,
  templateType: PT.string.isRequired,
  addMessage: PT.func.isRequired,
  isCarouselElem: PT.bool,
  templateIdentifier: PT.string
};

export function InteractiveMessage({ content, templateType, addMessage, textInputRef, isCarouselElem, templateIdentifier }) {
  const [ responseSelected, setResponseSelected] = useState(false);

  function onAddMessage(data){
    addMessage(data);
    setResponseSelected(true);
  }

  useLayoutEffect(()=> {
    if (!textInputRef || !textInputRef.current || !textInputRef.current.focus) {
      return;
    }
    textInputRef.current.focus();
  }, [responseSelected, textInputRef]);

  function renderTemplate(){
    if (templateType === InteractiveMessageType.LIST_PICKER) {
      return <ListPicker content={content} addMessage={onAddMessage} templateType={templateType} isCarouselElem={isCarouselElem} templateIdentifier={templateIdentifier} />
    } else if (templateType === InteractiveMessageType.PANEL) {
      return <Panel content={content} addMessage={onAddMessage}  templateType={templateType} isCarouselElem={isCarouselElem} templateIdentifier={templateIdentifier} />
    } else if (templateType === InteractiveMessageType.TIME_PICKER) {
      return <TimePicker content={content} addMessage={onAddMessage}/>
    }
  }

  // Render QuickReply and Carousel outside of <MessageBody />
  if (templateType === InteractiveMessageType.QUICK_REPLY) {
    return <QuickReply content={content} addMessage={onAddMessage}/>
  } else if (templateType === InteractiveMessageType.CAROUSEL) {
    return <Carousel content={content} addMessage={onAddMessage}/>
  }

  return (
    <MessageBody data-testid={templateIdentifier} isCarouselElem={isCarouselElem}>
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

HeaderText.propTypes = {
  title: PT.string.isRequired,
  subtitle: PT.string,
};

export function HeaderText({ title, subtitle }) {
  return (
    <TextSection>
        <RichMessageRenderer content={title} styledWrapper={Title} />
        {subtitle && (<RichMessageRenderer content={subtitle} styledWrapper={Subtitle} />)}
    </TextSection>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      stroke="none"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
  )
}

export function PickerElementLinkOption({ url, title, target, testId } ) {
  return (
    <PickerElementLink data-testid={testId}>
      <PickerOptionTitle hasNestedSVG={true}>
        <a href={url} target={target || "_blank"}>
          {title}
        </a>
        <ExternalLinkIcon />
      </PickerOptionTitle>
    </PickerElementLink>
  );
}

export { ReactiveImage, TextSection, Title, Subtitle, ResponsesSection, MessageBody, PickerOptionTitle }
