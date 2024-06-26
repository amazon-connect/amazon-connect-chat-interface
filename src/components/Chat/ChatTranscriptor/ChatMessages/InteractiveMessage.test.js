// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { screen } from "@testing-library/dom";
import { HeaderText } from "./InteractiveMessage";
import { InteractiveMessage } from "./InteractiveMessage";
import { mockQuickReplyContent } from "./InteractiveMessages/QuickReply.test";
import { mockCarouselContent } from "./InteractiveMessages/Carousel.test";
import { ContentType } from "../../datamodel/Model";

describe("HeaderText", () => {
  const MOCK_TITLE = "MockTitle";
  const MOCK_SUBTITLE = "MockSubtitle";

  const renderComponent = (customProps) => {
    render(
      <ThemeProvider>
        <HeaderText {...customProps} />
      </ThemeProvider>
    );
  };

  it("should render plain text header", () => {
    renderComponent({
      title: MOCK_TITLE,
      subtitle: MOCK_SUBTITLE,
    });

    expect(screen.getByText(MOCK_TITLE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_SUBTITLE)).toBeInTheDocument();
  });

  it("should render without subtitle prop", () => {
    renderComponent({
      title: MOCK_TITLE,
      subtitle: null,
    });

    expect(screen.getByText(MOCK_TITLE)).toBeInTheDocument();
    expect(() => screen.getByText(MOCK_SUBTITLE)).toThrow(
      "Unable to find an element"
    );
  });

  it.each([
    ["**", "strong"],
    ["__", "strong"],
    ["*", "em"],
    ["_", "em"],
  ])(
    "should render rich text header title: [%s]",
    (markdownSyntax, expectedElem) => {
      renderComponent({
        title: `${markdownSyntax}${MOCK_TITLE}${markdownSyntax}`,
        subtitle: `${markdownSyntax}${MOCK_SUBTITLE}${markdownSyntax}`,
      });

      const titleElem = screen.getByText(MOCK_TITLE);
      expect(titleElem).toBeInTheDocument();
      expect(titleElem.parentElement.innerHTML).toBe(
        `<${expectedElem}>${MOCK_TITLE}</${expectedElem}>`
      );
      const subtitleElem = screen.getByText(MOCK_SUBTITLE);
      expect(subtitleElem).toBeInTheDocument();
      expect(subtitleElem.parentElement.innerHTML).toBe(
        `<${expectedElem}>${MOCK_SUBTITLE}</${expectedElem}>`
      );
    }
  );

  it.each([
    [
      "https://plainlink",
      '<a style="margin: 0px; text-decoration: none;" href="https://plainlink" target="_blank" rel="noopener noreferrer">https://plainlink</a>',
    ],
    [
      "http://plainlink",
      '<a style="margin: 0px; text-decoration: none;" href="http://plainlink" target="_blank" rel="noopener noreferrer">http://plainlink</a>',
    ],
    [
      "https://amazon.com",
      '<a style="margin: 0px; text-decoration: none;" href="https://amazon.com" target="_blank" rel="noopener noreferrer">https://amazon.com</a>',
    ],
    [
      "https://aws.amazon.com",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">https://aws.amazon.com</a>',
    ],
  ])("should detect and render plain link: [%s]", (plainText, expectedHTML) => {
    renderComponent({
      title: `${MOCK_TITLE} ${plainText}`,
      subtitle: `${MOCK_SUBTITLE} ${plainText}`,
    });

    const titleElem = screen.getByText(MOCK_TITLE);
    expect(titleElem).toBeInTheDocument();
    expect(titleElem.innerHTML).toBe(`${MOCK_TITLE} ${expectedHTML}`);
    const subtitleElem = screen.getByText(MOCK_SUBTITLE);
    expect(subtitleElem).toBeInTheDocument();
    expect(subtitleElem.innerHTML).toBe(`${MOCK_SUBTITLE} ${expectedHTML}`);
  });

  it.each([
    [
      "[aws.amazon.com](https://aws.amazon.com)",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">aws.amazon.com</a>',
    ],
    [
      "[custom text](https://aws.amazon.com)",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">custom text</a>',
    ],
    [
      "[custom text](customLink)",
      '<a style="margin: 0px; text-decoration: none;" href="http://customLink" target="_blank" rel="noopener noreferrer">custom text</a>',
    ],
  ])(
    "should detect and render markdown syntax link: [%s]",
    (plainText, expectedHTML) => {
      renderComponent({
        title: `${MOCK_TITLE} ${plainText}`,
        subtitle: `${MOCK_SUBTITLE} ${plainText}`,
      });

      const titleElem = screen.getByText(MOCK_TITLE);
      expect(titleElem).toBeInTheDocument();
      expect(titleElem.innerHTML).toBe(`${MOCK_TITLE} ${expectedHTML}`);
      const subtitleElem = screen.getByText(MOCK_SUBTITLE);
      expect(subtitleElem).toBeInTheDocument();
      expect(subtitleElem.innerHTML).toBe(`${MOCK_SUBTITLE} ${expectedHTML}`);
    }
  );

  it.each([
    [
      "[aws.amazon.com](https://aws.amazon.com)<!--rehype:target=_self-->",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com">aws.amazon.com</a>',
    ],
    [
      "[aws.amazon.com](https://aws.amazon.com)<!--rehype:style=color:pink-->",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">aws.amazon.com</a>',
    ],
    [
      "[aws.amazon.com](https://aws.amazon.com)<!--rehype:rel=external-->",
      '<a style="margin: 0px; text-decoration: none;" href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">aws.amazon.com</a>',
    ],
  ])(
    "should detect and render rehype attribute syntax link: [%s]",
    (plainText, expectedHTML) => {
      renderComponent({
        title: `${MOCK_TITLE} ${plainText}`,
        subtitle: `${MOCK_SUBTITLE} ${plainText}`,
      });

      const titleElem = screen.getByText(MOCK_TITLE);
      expect(titleElem).toBeInTheDocument();
      expect(titleElem.innerHTML).toBe(`${MOCK_TITLE} ${expectedHTML}`);
      const subtitleElem = screen.getByText(MOCK_SUBTITLE);
      expect(subtitleElem).toBeInTheDocument();
      expect(subtitleElem.innerHTML).toBe(`${MOCK_SUBTITLE} ${expectedHTML}`);
    }
  );
});

describe("Interactive message", () => {
  const mockProps = {
    content: {
      title: "ListPickerTitle",
      subtitle: "ListPickerSubtitle",
      elements: [
        {
          title: "ListPickerElementTitle",
          subtitle: "ListPickerElementSubtitle",
          imageData: "ListPickerElementImageData",
          imageDescription: "ListPickerElementImageDescription",
        },
        {
          title: "AnotherListPickerElementTitle",
          subtitle: "AnotherListPickerElementSubtitle",
          imageData: "AnotherListPickerElementImageData",
          imageDescription: "AnotherListPickerElementImageDescription",
        },
      ],
      imageData: "ListPickerImageData",
      imageDescription: "ListPickerImageDescription",
    },
    addMessage: jest.fn(),
    textInputRef: React.createRef(),
  };
  function renderComponent(props) {
    render(
      <ThemeProvider>
        <InteractiveMessage {...props} />
      </ThemeProvider>
    );
  }

  it("should render interactive message -> list picker component correctly", () => {
    renderComponent({ ...mockProps, templateType: "ListPicker" });
    expect(screen.getByText("ListPickerElementTitle")).toBeInTheDocument();
  });
  it("should render interactive message -> panel picker component correctly", () => {
    renderComponent({ ...mockProps, templateType: "Panel" });
    expect(screen.getByText("ListPickerElementTitle")).toBeInTheDocument();
  });
  it("should render interactive message -> time picker component correctly", () => {
    const timePickerContent = {
      title: "Schedule appointment",
      subtitle: "Tap to select option",
      timeslots: [
        {
          date: "2024-01-02T00:00+00:00",
          duration: 60,
        },
        {
          date: "2024-01-03T00:00+00:00",
          duration: 60,
        },
        {
          date: "2024-01-04T00:00+00:00",
          duration: 60,
        },
      ],
      location: {
        title: "Oscar",
        latitude: 47.616299,
        longitude: -122.333031,
        radius: 1,
      },
      timeZoneOffset: -420,
    };
    renderComponent({
      ...mockProps,
      templateType: "TimePicker",
      content: timePickerContent,
    });
    expect(screen.getByText("Schedule appointment")).toBeInTheDocument();
  });
  it("should render interactive message -> quickreply component correctly", () => {
    renderComponent({
      ...mockProps,
      templateType: "QuickReply",
      content: mockQuickReplyContent,
    });
    expect(screen.getByText(mockQuickReplyContent.title)).toBeInTheDocument();
  });
  it("should render interactive message -> carousel component correctly", () => {
    renderComponent({
      ...mockProps,
      templateType: "Carousel",
      content: mockCarouselContent,
    });
    expect(screen.getByText(mockCarouselContent.title)).toBeInTheDocument();
  });
  it("should show and fire events for view renderer component", () => {
    renderComponent({
      ...mockProps,
      templateType: "ViewResource",
      content: { Name: "ViewName" }, // content does not matter, we are only checking if component is in dom
    });
    let renderer_element = screen.getByTestId("connect-view-renderer");
    expect(renderer_element).toBeInTheDocument();

    expect(mockProps.addMessage).toHaveBeenCalledTimes(0);

    fireEvent(renderer_element, new CustomEvent('onAction', {
      detail: { Action: 'action' }
    }));

    let message = JSON.stringify({
      action: 'action',
      data: {},
      templateType: "ViewResource",
      version: '1.0'
    });

    message = { text: message, type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_RESPONSE };

    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage.mock.calls[0][0]).toEqual(message);
  });
});
