// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React, { useState } from "react";
import styled from "styled-components";
import PT from "prop-types";
import { Button } from "connect-core";
import {
  ReactiveImage,
  TextSection,
  ResponsesSection,
  Title,
  Subtitle
} from "../InteractiveMessage";
import RichLinkRenderer from "./RichLinkRenderer";
 
// have to calculate max height to maintain 16:9 aspect ratio
const ImageContainer = styled.div`
  max-height: calc(95vw * (9/16));
  overflow: hidden;
  display: ${props => props.showImage ? "flex" : "none"};
`;
 
const ListElementButton = styled(Button)`
  display: flex;
  justify-content: ${props => props.hasImage ? "flex-start" : "center"};
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
 
const ElementImageContainer = styled.div`
    width: ${props => props.theme.spacing.xxlarge};
    height: ${props => props.theme.spacing.xxlarge};
    border: ${({ theme }) => theme.globals.baseBorder};
    border-radius: ${({ theme }) => theme.spacing.mini};
    flex-shrink: 0;
    margin-right: ${({ theme }) => theme.spacing.small};
    display: ${props => props.showImage ? "inline-flex" : "none"};
`;
 
function ListPickerElement({ element, onClick, showImage, onImageLoad }) {
  const { title, subtitle, imageData, imageDescription } = element;
 
  return (
    <ListElementButton value={title} hasImage={showImage && imageData} onClick={onClick}>
      {imageData &&
      <ElementImageContainer showImage={showImage}>
        <ReactiveImage imageSrc={imageData} imageDescription={imageDescription} onImageLoad={onImageLoad}/>
      </ElementImageContainer>
      }
      <div>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
    </ListElementButton>
  );
}
 
ListPicker.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired
};
 
export default function ListPicker({ content, addMessage }) {
    console.error(content);
  // assumptions: version 1, image data is URL. Guarenteed title exists, at least 1 element.
  const { title, subtitle, elements, imageData, imageDescription } = content;
  const [ imageLoaded, setImageLoaded ] = useState(false);
  const [ elementImagesLoadedCount, setElementImagesLoadedCount ] = useState(0);
 
  function onImageLoad(){
    setImageLoaded(true);
  }
 
  function onElementImageLoad(){
    setElementImagesLoadedCount(elementImagesLoadedCount + 1);
  }
 
  function onItemClick(e) {
    addMessage({ text: e.currentTarget.value });
  }
 
  const showElementImages = elementImagesLoadedCount === elements.length;
 
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
          {elements.map((listPickerElement, index) =>
            <ListPickerElement key={'element-' + index} element={listPickerElement} onClick={onItemClick}
                               showImage={showElementImages} onImageLoad={onElementImageLoad}  />
          )}
        </div>
      </ResponsesSection>
    </>
  );
};