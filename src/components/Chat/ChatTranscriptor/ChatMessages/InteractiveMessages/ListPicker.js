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
  Subtitle,
} from "../InteractiveMessage";
import Linkify from "react-linkify";
import { createInteractiveMessagePayload } from "../../../../../utils/helper";

// have to calculate max height to maintain 16:9 aspect ratio
const ImageContainer = styled.div`
  max-height: calc(95vw * (9 / 16));
  overflow: hidden;
  display: ${(props) => (props.showImage ? "flex" : "none")};
`;

// Action buttons(SHOW_MORE/PREVIOUS_OPTIONS) always align to center
const ListElementButton = styled(Button)`
  display: flex;
  justify-content: ${(props) =>
    props.hasImage || !props.isActionButton ? "flex-start" : "center"};
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
  width: ${(props) => props.theme.spacing.xxlarge};
  height: ${(props) => props.theme.spacing.xxlarge};
  border: ${({ theme }) => theme.globals.baseBorder};
  border-radius: ${({ theme }) => theme.spacing.mini};
  flex-shrink: 0;
  margin-right: ${({ theme }) => theme.spacing.small};
  display: ${(props) => (props.showImage ? "inline-flex" : "none")};
`;

function ListPickerElement({
  element,
  onClick,
  showImage,
  onImageLoad,
  index,
}) {
  const { title, subtitle, imageData, imageDescription, actionDetail } =
    element;

  return (
    <ListElementButton
      value={title}
      hasImage={showImage && imageData}
      onClick={onClick}
      isActionButton={!!actionDetail}
      data-testid={"listElementButton" + index}
    >
      {imageData && (
        <ElementImageContainer showImage={showImage}>
          <ReactiveImage
            imageSrc={imageData}
            imageDescription={imageDescription}
            onImageLoad={onImageLoad}
          />
        </ElementImageContainer>
      )}
      <div>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
    </ListElementButton>
  );
}

ListPicker.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired,
};

export default function ListPicker({ content, addMessage, templateType }) {
  // assumptions: version 1, image data is URL. Guarenteed title exists, at least 1 element.
  const {
    title,
    subtitle,
    elements,
    imageData,
    imageDescription,
    preIndex,
    nextIndex,
    listId,
    referenceId,
  } = content;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [elementImagesLoadedCount, setElementImagesLoadedCount] = useState(0);

  function onImageLoad() {
    setImageLoaded(true);
  }

  function onElementImageLoad() {
    setElementImagesLoadedCount(elementImagesLoadedCount + 1);
  }

  function onItemClick(index) {
    const selectedElement = elements[index];
    const payload = createInteractiveMessagePayload(
      selectedElement,
      preIndex,
      nextIndex,
      listId,
      templateType,
      referenceId
    );
    addMessage(payload);
  }

  const showElementImages = () => {
    const actionBtnCount = elements.filter((ele) => {
      return ele.actionDetail;
    }).length;
    return elementImagesLoadedCount === elements.length - actionBtnCount;
  };

  return (
    <>
      {imageData && (
        <ImageContainer showImage={imageLoaded}>
          <ReactiveImage
            imageSrc={imageData}
            imageDescription={imageDescription}
            onImageLoad={onImageLoad}
          />
        </ImageContainer>
      )}
      <TextSection>
        <Title>
          <Linkify properties={{ target: "_blank" }}>{title}</Linkify>
        </Title>
        {subtitle && (
          <Subtitle>
            <Linkify properties={{ target: "_blank" }}>{subtitle}</Linkify>
          </Subtitle>
        )}
      </TextSection>
      <ResponsesSection>
        <div>
          {elements.map((listPickerElement, index) => (
            <ListPickerElement
              key={"element-" + index}
              element={listPickerElement}
              onClick={() => {
                onItemClick(index);
              }}
              showImage={showElementImages()}
              onImageLoad={onElementImageLoad}
              index={index}
            />
          ))}
        </div>
      </ResponsesSection>
    </>
  );
}
