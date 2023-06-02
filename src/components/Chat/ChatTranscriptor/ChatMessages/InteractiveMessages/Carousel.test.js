// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { screen, render, fireEvent, within } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import Carousel, { formatCarouselInteractiveSelection, isCarouselSelectionMessage } from "./Carousel";
import * as helpers from "../../../../../utils/helper";
import { InteractiveMessageSelectionType, InteractiveMessageType } from "../../../datamodel/Model";

const CAROUSEL_CONSTRAINTS = helpers.INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.CAROUSEL];

const mockNestedPanelPickerFlights = {
  templateType: "Panel",
  version: "1.0",
  templateIdentifier: "asdf0001",
  data: {
    content: {
      title: "Flight",
      subtitle: "Select an option:",
      elements: [
        {
          title: "Purchase Ticket",
        },
        {
          title: "View All Destinations",
        },
        {
          title: "Learn More",
          type: InteractiveMessageSelectionType.HYPERLINK,
          url: "https://example.com",
        },
      ],
    },
  },
};
const mockNestedPanelPickerHotels = {
  templateType: "Panel",
  version: "1.0",
  templateIdentifier: "asdf0002",
  data: {
    content: {
      title: "Hotel",
      subtitle: "Select an option:",
      imageType: "URL",
      imageData: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/a1/9c/80/essentia-luxury-hotel.jpg?w=700&h=-1&s=1",
      imageDescription: "Hotel Destination",
      elements: [
        {
          title: "Book Room",
        },
        {
          title: "View All Listings",
        },
        {
          title: "Learn More",
          type: InteractiveMessageSelectionType.HYPERLINK,
          url: "https://example.com",
        },
      ],
    },
  },
};
const mockNestedListPickerDining = {
  templateType: "ListPicker",
  version: "1.0",
  templateIdentifier: "asdf0003",
  data: {
    content: {
      title: "Dining",
      subtitle: "Select an option:",
      elements: [
        {
          title: "Book Table",
        },
        {
          title: "View Popular Entrees",
        },
        {
          title: "Learn More",
          type: InteractiveMessageSelectionType.HYPERLINK,
          url: "https://example.com",
        },
      ],
    },
  },
};

export const mockCarouselContent = {
  title: "Explore our travel resources",
  elements: [mockNestedPanelPickerFlights, mockNestedPanelPickerHotels, mockNestedListPickerDining],
};

describe("<Carousel />", () => {
  let mockProps;

  function renderElement(props) {
    return render(
      <ThemeProvider>
        <Carousel {...props} />
      </ThemeProvider>
    );
  }

  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockCarouselContent, addMessage: addMessage };
  });
  window.connect = {
    csmService: {
      addCountMetric: jest.fn().mockImplementation(() => {}),
    }
  }
  it("Style should match the snapshot", () => {
    const mockCarousel = renderElement(mockProps);
    expect(mockCarousel).toMatchSnapshot();
  });

  it("Should include all necessary data-testid values for integ/canary tests", () => {
    renderElement(mockProps);

    expect(screen.getByTestId("interactive-carousel-message-title")).toBeInTheDocument();
    expect(screen.getByTestId("interactive-carousel-scroll-left-btn")).toBeInTheDocument();
    expect(screen.getByTestId("interactive-carousel-scroll-right-btn")).toBeInTheDocument();
    expect(screen.getByTestId("interactive-carousel-response-section")).toBeInTheDocument();

    mockCarouselContent.elements.forEach(({ templateIdentifier }) => {
      expect(screen.getByTestId(templateIdentifier)).toBeDefined();
    });
  });

  it("Should render Carousel title and all nested picker elements", () => {
    renderElement(mockProps);

    // Renders Carousel message title
    expect(screen.getByText(mockCarouselContent.title)).toBeDefined();

    // Renders each nested picker
    mockCarouselContent.elements.forEach(({ templateIdentifier, data }) => {
      const { title, subtitle, elements } = data.content;
      expect(screen.getByTestId(templateIdentifier)).toBeDefined();
      const { getByText: nestedElemGetByText } = within(screen.getByTestId(templateIdentifier));

      // Nested picker title/subtitle
      expect(nestedElemGetByText(title)).toBeDefined();
      expect(nestedElemGetByText(subtitle)).toBeDefined();

      // Nested picker elements
      elements.forEach(({ title: nestedPickerTitle, imageData, imageDescription }) => {
        expect(nestedElemGetByText(nestedPickerTitle)).toBeDefined();

        if (imageData && imageDescription) {
          const nestedPickerImage = getByAltText(imageDescription);
          expect(nestedPickerImage.src).toContain(imageData);
        }
      });
    });
  });

  it("Should be able to use Carousel", () => {
    renderElement(mockProps);

    const nestedPickerToChoose = mockNestedPanelPickerFlights;
    const { content } = nestedPickerToChoose.data;
    const optionToChoose = content.elements[1].title; // "View All Destinations"
    expect(screen.getByTestId(nestedPickerToChoose.templateIdentifier)).toBeDefined();
    const { getByText: nestedElemGetByText } = within(screen.getByTestId(nestedPickerToChoose.templateIdentifier));

    fireEvent.click(nestedElemGetByText(optionToChoose));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: JSON.stringify({
        templateIdentifier: nestedPickerToChoose.templateIdentifier,
        listTitle: content.title,
        selectionText: optionToChoose,
      }),
    });
  });

  it("Should only render up to 5 nested pickers", () => {
    const carouselOverFiveLimit = {
      ...mockCarouselContent,
      elements: [
        ...mockCarouselContent.elements,
        mockNestedPanelPickerFlights,
        mockNestedPanelPickerHotels,
        mockNestedListPickerDining,
        mockNestedPanelPickerFlights,
      ],
    };
    renderElement({ ...mockProps, content: carouselOverFiveLimit });

    expect(screen.getAllByText("Select an option:")).toHaveLength(5);
  });

  it("Should render reply option buttons and be accessible", () => {
    renderElement(mockProps);

    const responseSectionDiv = screen.getByTestId("interactive-carousel-response-section");
    const buttons = responseSectionDiv.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(button => {
      // Check that the button is accessible to screen readers
      expect(button).toHaveAccessibleName();
      button.click();
      expect(button).toBeEnabled();
    });
  });

  it("Should render left/right buttons and scroll the carousel", () => {
    renderElement(mockProps);

    const carouselContainer = screen.getByTestId("interactive-carousel-response-section");
    const leftButton = screen.getByTestId("interactive-carousel-scroll-left-btn");
    const rightButton = screen.getByTestId("interactive-carousel-scroll-right-btn");
    const initialScrollLeft = carouselContainer.scrollLeft;

    fireEvent.click(rightButton);

    expect(carouselContainer.scrollLeft).toBeGreaterThan(initialScrollLeft);

    fireEvent.click(leftButton);

    expect(carouselContainer.scrollLeft).toBe(initialScrollLeft);
  });

  it("Should render link elements for nested Panel or ListPicker templates", () => {
    renderElement(mockProps);

    const linkPickerElements = screen.getAllByText("Learn More");
    linkPickerElements.forEach(elem => {
      expect(elem).toHaveAttribute("href", "https://example.com");
    });
  });

  it("Should create interactive selection message payload", () => {
    renderElement(mockProps);
    const createMsgPayloadSpy = jest.spyOn(helpers, "createInteractiveMessagePayload");

    const nestedPickerToChoose = mockNestedPanelPickerFlights;
    const { content } = nestedPickerToChoose.data;
    const optionToChoose = content.elements[1].title; // "View All Destinations"
    expect(screen.getByTestId(nestedPickerToChoose.templateIdentifier)).toBeDefined();
    const { getByText: nestedElemGetByText } = within(screen.getByTestId(nestedPickerToChoose.templateIdentifier));

    fireEvent.click(nestedElemGetByText(optionToChoose));
    expect(createMsgPayloadSpy).toHaveBeenCalledWith(
      { title: optionToChoose },
      undefined,
      undefined,
      undefined,
      nestedPickerToChoose.templateType,
      undefined,
      true,
      content.title,
      nestedPickerToChoose.templateIdentifier
    );
    createMsgPayloadSpy.mockRestore();
  });

  it("Should truncate a title over the character limit", () => {
    const { titleCharLimit } = CAROUSEL_CONSTRAINTS;

    const longTitle = "LongTitle".repeat(150);
    const truncatedTitle = `${longTitle.substring(0, titleCharLimit)}...`;

    const carouselLongTitle = {
      ...mockCarouselContent,
      title: longTitle,
    };
    renderElement({ ...mockProps, content: carouselLongTitle });
    expect(() => screen.getByText(longTitle)).toThrow(
      "Unable to find an element"
    );
    expect(() => screen.getByText(truncatedTitle)).not.toThrow();
  });

  it("should use DOMPurify to mitigate malicious XSS input", () => {
    const mockCarouselXSSContent = {
      ...mockCarouselContent,
      title: '<div style="background-image: url(\'javascript:alert(\'XSS attack!\');\')"></div>',
    };
    renderElement({ ...mockProps, content: mockCarouselXSSContent });
    expect(screen.getByText("<div style=\"background-image: url('javascript:alert('XSS attack!');')\"></div>", { exact: false })).toBeDefined();
  });
});

describe("[Carousel] Transcipt message formatting util", () => {
  it("Should correctly verify Carousel interactive selection stringified object", () => {
    expect(isCarouselSelectionMessage("{}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": \"Bel Air\"}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": {}, \"selectionText\": {}}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": null, \"selectionText\": \"\"}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": \"\", \"selectionText\": \"\"}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": 9, \"selectionText\": 9}")).toBe(false);
    expect(isCarouselSelectionMessage("{\"listTitle\": \"Bel Air\", \"selectionText\": \"Book Room\"}")).toBe(false);

    expect(isCarouselSelectionMessage("{\"listTitle\": \"abc\", \"selectionText\": \"xyz\", \"templateIdentifier\": \"001\"}")).toBe(true);
    expect(isCarouselSelectionMessage("{\"listTitle\": \"Bel Air\", \"selectionText\": \"Book Room\", \"templateIdentifier\": \"001\"}")).toBe(true);
  });

  it("Should format a valid Carousel interactive selection stringified object", () => {
    const messageContent = JSON.stringify({ listTitle: "Flight", selectionText: "Purchase Ticket", templateIdentifier: "listPicker001" });
    expect(formatCarouselInteractiveSelection(messageContent)).toBe("Flight - Purchase Ticket");

    const messageContentColonFormat = JSON.stringify({ listTitle: "Flights:", selectionText: "Purchase Ticket" });
    expect(formatCarouselInteractiveSelection(messageContentColonFormat)).toBe("Flights: Purchase Ticket");
  });
});
