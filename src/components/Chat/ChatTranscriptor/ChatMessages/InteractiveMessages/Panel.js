// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React, { useState } from "react";
import { Button } from "connect-core";
import { Text } from "connect-core";
import {
  ReactiveImage,
  TextSection,
  ResponsesSection, Title, Subtitle
} from "../InteractiveMessage";
import styled from "styled-components";
import PT from "prop-types";
import RichLinkRenderer from "./RichLinkRenderer";
 
const ElementTitle = styled(Text)`
    font-weight: bold;
`;
 
const ImageContainer = styled.div`
  max-height: calc(95vw * (9/16));
  overflow: hidden;
  display: ${props => props.showImage ? "flex" : "none"};
`;
 
const PanelButton = styled(Button)`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: none;
  border: ${({ theme }) => theme.globals.baseBorder};  
  white-space: pre-line;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary};
  }
  
  &:last-of-type {
    border-bottom-left-radius: ${({ theme }) => theme.spacing.mini};
    border-bottom-right-radius: ${({ theme }) => theme.spacing.mini};
    margin-bottom: 0;   
  }
`;
 
Panel.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired
};
 
export default function Panel({ content, addMessage }) {
  // assumptions: version 1, image data is URL. Guarenteed title exists, at least 1 element.
  const { title, subtitle, elements, imageData, imageDescription } = content;
  const [ imageLoaded, setImageLoaded ] = useState(false);
 
  function onImageLoad(){
      setImageLoaded(true);
  }
 
  function onItemClick(e) {
    addMessage({ text: e.currentTarget.value });
  }
 
  return (
    <>
      {(imageData) &&
      <ImageContainer showImage={imageLoaded}>
          <ReactiveImage imageSrc={imageData} imageDescription={imageDescription} onImageLoad={onImageLoad}/>
      </ImageContainer>
      }
      <TextSection>
        <RichLinkRenderer content={title} styledElement={Title} />
        {subtitle && (
          <RichLinkRenderer content={subtitle} styledElement={Subtitle} />
        )}
      </TextSection>
      <ResponsesSection>
        <div>
          {elements.map((element, index) =>
            <PanelButton value={element.title} key={'element-' + index} onClick={onItemClick}>
              <ElementTitle>{element.title}</ElementTitle>
            </PanelButton>
          )}
        </div>
      </ResponsesSection>
    </>
  );
}