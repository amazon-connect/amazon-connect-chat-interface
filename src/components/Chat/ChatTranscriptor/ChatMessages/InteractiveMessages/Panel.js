// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import { Button } from "connect-core";
import {
  ReactiveImage,
  ResponsesSection,
  HeaderText,
  PickerOptionTitle,
  PickerElementLinkOption
} from "../InteractiveMessage";
import styled from "styled-components";
import PT from "prop-types";
import { InteractiveMessageSelectionType, InteractiveMessageType } from "../../../datamodel/Model";
import { createInteractiveMessagePayload, truncateElementFromLimit, truncateStrFromCharLimit } from "../../../../../utils/helper";

//#region Styled Components
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

  /* Last child could be <a/>, only round last child */
  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.spacing.mini};
    border-bottom-right-radius: ${({ theme }) => theme.spacing.mini};
    margin-bottom: 0;
  }
`;
//#endregion Styled Components

function PanelPickerElement({ element, handleButtonClick }) {
  const { title: inputTitle, type, url } = element;
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.PANEL, "elementTitleCharLimit");

  if (type === InteractiveMessageSelectionType.HYPERLINK && url) {
    return <PickerElementLinkOption {...element} />
  }

  return (
    <PanelButton value={title} onClick={handleButtonClick}>
      <PickerOptionTitle>{title}</PickerOptionTitle>
    </PanelButton>
  );
}

Panel.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired,
  isCarouselElem: PT.bool,
  templateIdentifier: PT.string
};

export default function Panel({
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
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.PANEL, "titleCharLimit");
  const subtitle = truncateStrFromCharLimit(inputSubtitle, InteractiveMessageType.PANEL, "subtitleCharLimit");
  const elements = truncateElementFromLimit(inputElements, InteractiveMessageType.PANEL, "elementsRenderedMax");

  const [imageLoaded, setImageLoaded] = useState(false);

  function onImageLoad() {
    setImageLoaded(true);
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
          {elements.map((element, index) => (
            <PanelPickerElement
              key={"element-" + index}
              handleButtonClick={() => {
                onItemClick(index);
              }}
              element={element}
            />
          ))}
        </div>
      </ResponsesSection>
    </>
  );
}
