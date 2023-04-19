// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import { Button } from "connect-core";
import { Text } from "connect-core";
import {
  ReactiveImage,
  TextSection,
  ResponsesSection,
  Title,
  Subtitle,
} from "../InteractiveMessage";
import styled from "styled-components";
import PT from "prop-types";
import Linkify from "react-linkify";
import { createInteractiveMessagePayload } from "../../../../../utils/helper";

const ElementTitle = styled(Text)`
  font-weight: bold;
`;

const ImageContainer = styled.div`
  max-height: calc(95vw * (9 / 16));
  overflow: hidden;
  display: ${(props) => (props.showImage ? "flex" : "none")};
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
  addMessage: PT.func.isRequired,
};

export default function Panel({ content, addMessage, templateType }) {
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
      referenceId
    );
    addMessage(payload);
  }

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
          {elements.map((element, index) => (
            <PanelButton
              value={element.title}
              key={"element-" + index}
              onClick={() => {
                onItemClick(index);
              }}
            >
              <ElementTitle>{element.title}</ElementTitle>
            </PanelButton>
          ))}
        </div>
      </ResponsesSection>
    </>
  );
}
