// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef } from "react";
import styled from "styled-components";
import PT from "prop-types";
import { RichMessageRenderer } from "../../../RichMessageComponents";
import { InteractiveMessage, MessageBody } from "../InteractiveMessage";
import { Button } from "connect-core";
import { truncateStrFromCharLimit } from "../../../../../utils/helper";
import isJSON from "is-json";
import { InteractiveMessageType } from "../../../datamodel/Model";

const SCROLL_OFFSET_AMOUNT = 200; // clicking arrow button scrolls horizontally, css will still snap to start of element

// Detect carousel interactive selection stringified object => "{\"listTitle\": \"Bel Air\", \"selectionText\": \"Book Room\"}"
export function isCarouselSelectionMessage(messageContent) {
  if (isJSON(messageContent)) {
    const parsedContent = JSON.parse(messageContent);
    const expectedSelectionKeys = ["listTitle", "selectionText", "templateIdentifier"];

    return expectedSelectionKeys.every(key => key in parsedContent && typeof parsedContent[key] === "string");
  }

  return false;
}

// Convert stringified object into readable transcript message => "Flights - Purchase Ticket"
export function formatCarouselInteractiveSelection(messageContent) {
  const { listTitle, selectionText } = JSON.parse(messageContent);

  const optionalColon = listTitle.slice(-1) === ":" ? "" : " -";
  return `${listTitle}${optionalColon} ${selectionText}`;
}

//#region Styled Components
const ResponsesSection = styled.div`
  padding: ${({ theme }) => theme.spacing.base};
  margin: 0 ${({ theme }) => theme.spacing.mini};
  display: flex;
  gap: 2%;
  overflow-x: scroll;
  position: relative;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;

  /* Hide scrollbar */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const ScrollButton = styled(Button)`
  cursor: pointer;
  position: absolute;
  top: 50%;
  display: block;
  --offset-x: 0;
  z-index: 99;
  ${props => (props.direction === "right" ? "right: 0;" : "")}

  width: 32px;
  height: 32px;
  border: 2px solid #fff;
  border-radius: 50%;

  background-size: 14px auto;
  background: white;
  -webkit-box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
`;
const ChevronIconWrapper = styled.div`
  font-size: 0;
  transform: rotate(${props => (props.direction === "left" ? "180" : "0")}deg);

  svg {
    width: 8px;
    height: 12px;
  }
`;
//#endregion Styled Components

function NestedInteractiveMessages({ elements, addMessage }) {
  return (
    <>
      {elements.map((element, index) => (
        <InteractiveMessage
          key={index}
          content={element.data.content}
          templateType={element.templateType}
          addMessage={addMessage}
          templateIdentifier={element.templateIdentifier}
          isCarouselElem={true}
        />
      ))}
    </>
  );
}

function ChevronIcon({ direction }) {
  return (
    <ChevronIconWrapper direction={direction}>
      <svg width='8px' height='12px' viewBox='0 0 8 12' xmlns='http://www.w3.org/2000/svg'>
        <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <polygon
            id='Path'
            fill='currentColor'
            fillRule='nonzero'
            points='2 0 0.59 1.41 5.17 6 0.59 10.59 2 12 8 6'
          ></polygon>
        </g>
      </svg>
    </ChevronIconWrapper>
  );
}

Carousel.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired,
};

/**
 * Renders a scrollable (horizontal) carousel of interactive messages.
 *  - Supported templates: Panel, ListPicker
 *  - Render maximum of 5 elements
 */
export default function Carousel({ content, addMessage }) {
  // assumptions: version 1. Guaranteed title exists, at least 2 elements.
  const { title: inputTitle, elements: inputElems } = content;
  const scrollerRef = useRef(null);

  const handleScrollLeft = () => {
    scrollerRef.current.scrollLeft += SCROLL_OFFSET_AMOUNT * -1;
  };

  const handleScrollRight = () => {
    scrollerRef.current.scrollLeft += SCROLL_OFFSET_AMOUNT;
  };

  // Frontend field validations
  const title = truncateStrFromCharLimit(inputTitle, InteractiveMessageType.CAROUSEL, "titleCharLimit");

  return (
    <>
      <MessageBody addChildBackgroundStyles={true} data-testid='interactive-carousel-message-title' applySpeechBubbleCaret={true}>
        <RichMessageRenderer content={title} />
      </MessageBody>

      <ScrollButton
        onKeyPress={handleScrollLeft}
        onClick={handleScrollLeft}
        data-testid='interactive-carousel-scroll-left-btn'
        direction={"left"}
      >
        <ChevronIcon direction={"left"} />
      </ScrollButton>

      <ResponsesSection ref={scrollerRef} data-testid='interactive-carousel-response-section'>
        <NestedInteractiveMessages elements={inputElems} addMessage={addMessage} />
      </ResponsesSection>

      <ScrollButton
        onKeyPress={handleScrollRight}
        onClick={handleScrollRight}
        data-testid='interactive-carousel-scroll-right-btn'
        direction={"right"}
      >
        <ChevronIcon direction={"right"} />
      </ScrollButton>
    </>
  );
}
