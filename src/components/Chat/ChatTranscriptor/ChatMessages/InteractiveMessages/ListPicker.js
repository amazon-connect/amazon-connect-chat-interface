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
  HeaderText,
  Title,
  Subtitle,
  PickerOptionTitle,
  PickerElementLinkOption
} from "../InteractiveMessage";
import { createInteractiveMessagePayload, truncateElementFromLimit, truncateStrFromCharLimit } from "../../../../../utils/helper";
import { InteractiveMessageSelectionType, InteractiveMessageType } from "../../../datamodel/Model";
import { RichMessageRenderer } from "../../../RichMessageComponents";

//#region Styled Components
// have to calculate max height to maintain 16:9 aspect ratio
const ImageContainer = styled.div`
  max-height: calc(95vw * (9 / 16));
  overflow: hidden;
  display: ${(props) => (props.showImage ? "flex" : "none")};

  ${props => props.isCarouselElem ? `
    img {
      float: left;
      height: 10rem;
      object-fit: cover;
    }
  ` : ""}
`;

// Align-right when using subtitle and/or image - otherwise center the text
// Action buttons(SHOW_MORE/PREVIOUS_OPTIONS) always align to center
const ListElementButton = styled(Button)`
  display: flex;
  justify-content: ${(props) => (props.isFloatLeft ? "flex-start" : "center")};
  width: 100%;
  max-width: none;
  border: ${({ theme }) => theme.globals.baseBorder};
  white-space: pre-line;

  &:hover {
    background: ${({ theme }) => theme.color.primary};
  }

  /* Last child could be <a/>, only round last child */
  &:last-child {
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
//#endregion Styled Components

function ListPickerElement({
  element,
  onClick,
  showImage,
  onImageLoad,
  index,
}) {
  const { title: inputTitle, subtitle: inputSubtitle, imageData, imageDescription, type, url } = element;
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.LIST_PICKER, "elementTitleCharLimit");
  const subtitle = truncateStrFromCharLimit(inputSubtitle, InteractiveMessageType.LIST_PICKER, "elementSubtitleCharLimit");

  if (type === InteractiveMessageSelectionType.HYPERLINK && url) {
    return (
      <PickerElementLinkOption
        {...element}
        testId={"listElement" + index}
        title={title}
      />
    )
  }

  return (
    <ListElementButton
      value={title}
      isFloatLeft={(showImage && imageData) || subtitle}
      onClick={onClick}
      data-testid={"listElement" + index}
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
      {subtitle ? (
        <TextSection>
            <RichMessageRenderer content={title} styledWrapper={Title} />
            <RichMessageRenderer content={subtitle} styledWrapper={Subtitle} />
        </TextSection>
      ) : (
        <PickerOptionTitle>{title}</PickerOptionTitle>
      )}
    </ListElementButton>
  );
}

ListPicker.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired,
  isCarouselElem: PT.bool,
  templateIdentifier: PT.string
};

export default function ListPicker({
  content,
  addMessage,
  templateType,
  isCarouselElem,
  templateIdentifier
}) {
  // assumptions: version 1, image data is URL. Guarenteed title exists, at least 1 element.
  const {
    title: inputTitle,
    subtitle: inputSubtitle,
    elements: inputElements,
    imageData,
    imageDescription,
    preIndex,
    nextIndex,
    listId,
    referenceId,
  } = content;

  // Frontend field validations
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.LIST_PICKER, "titleCharLimit");
  const subtitle = truncateStrFromCharLimit(inputSubtitle, InteractiveMessageType.LIST_PICKER, "subtitleCharLimit");
  const elements = truncateElementFromLimit(inputElements, InteractiveMessageType.LIST_PICKER, "elementsRenderedMax");

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
      referenceId,
      isCarouselElem,
      title,
      templateIdentifier
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
        <ImageContainer showImage={imageLoaded} isCarouselElem={isCarouselElem}>
          <ReactiveImage
            imageSrc={imageData}
            imageDescription={imageDescription}
            onImageLoad={onImageLoad}
          />
        </ImageContainer>
      )}
      <HeaderText title={title} subtitle={subtitle} />
      <ResponsesSection isCarouselElem={isCarouselElem}>
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
