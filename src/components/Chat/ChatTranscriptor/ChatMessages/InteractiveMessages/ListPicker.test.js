// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import ListPicker from "./ListPicker";
import { InteractiveMessageType } from "../../../datamodel/Model";
import { INTERACTIVE_MESSAGE } from "../../../constants";
import "@testing-library/jest-dom/extend-expect";
import * as helpers from '../../../../../utils/helper';

const LIST_PICKER_CONSTRAINTS = helpers.INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.LIST_PICKER];

const mockListPickerContent = {
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
};

export const mockListPickerData = JSON.stringify({
  templateType: InteractiveMessageType.LIST_PICKER,
  isCustomInteractive: "true",
  version: "1.0",
  data: {
    content: mockListPickerContent,
  },
});

describe("<ListPicker />", () => {
  let mockProps;

  function renderElement(props) {
    return render(
      <ThemeProvider>
        <ListPicker {...props} />
      </ThemeProvider>
    );
  }

  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockListPickerContent, addMessage: addMessage, templateType: InteractiveMessageType.LIST_PICKER };
  });

  it("style should match the snapshot", () => {
    const mockListPicker = renderElement(mockProps);
    expect(mockListPicker).toMatchSnapshot();
  });

  it("should be able to use ListPicker", () => {
    renderElement(mockProps);

    expect(screen.getByText("ListPickerTitle")).toBeDefined();
    expect(screen.getByText("ListPickerSubtitle")).toBeDefined();
    expect(screen.getByAltText("ListPickerImageDescription")).toBeDefined();

    expect(screen.getByText("ListPickerElementTitle")).toBeDefined();
    expect(screen.getByText("AnotherListPickerElementTitle")).toBeDefined();
    expect(
      screen.getByAltText("ListPickerElementImageDescription")
    ).toBeDefined();
    expect(
      screen.getByAltText("AnotherListPickerElementImageDescription")
    ).toBeDefined();

    fireEvent.click(screen.getByText("ListPickerElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: "ListPickerElementTitle",
    });
  });

  it("Should create interactive selection message payload", () => {
    renderElement(mockProps);

    const createMsgPayloadSpy = jest.spyOn(helpers, 'createInteractiveMessagePayload');
    fireEvent.click(screen.getByText("ListPickerElementTitle"));
    expect(createMsgPayloadSpy).toHaveBeenCalledWith(mockListPickerContent.elements[0], undefined, undefined, undefined, InteractiveMessageType.LIST_PICKER, undefined, undefined, "ListPickerTitle", undefined);

    createMsgPayloadSpy.mockRestore();
  });

  it("Should only render max number of elements", () => {
    const { elementsRenderedMax } = LIST_PICKER_CONSTRAINTS;

    const listPickerOverElementLimit = {
      ...mockListPickerContent,
      elements: Array.apply(null, Array(elementsRenderedMax + 3)).map((e, index) => ({ title: `ListPickerElement${index}` })),
    };
    renderElement({ ...mockProps, content: listPickerOverElementLimit });

    const elementOptions = screen.getAllByRole("button");
    expect(elementOptions).toHaveLength(elementsRenderedMax);
    expect(() => screen.getByText(`ListPickerElement${elementsRenderedMax}`)).toThrow(
      "Unable to find an element"
    );
    expect(() => screen.getByText(`ListPickerElement${elementsRenderedMax - 1}`)).not.toThrow();
  });

  it.each([
      ["title", LIST_PICKER_CONSTRAINTS.titleCharLimit],
      ["subtitle", LIST_PICKER_CONSTRAINTS.subtitleCharLimit]
  ])("should truncate a %s over the character limit", (fieldKey, charLimit) => {
      const longTitle = "LongTitle".repeat(150);
      const truncatedTitle = `${longTitle.substring(0, charLimit)}...`;

      const listPickerLongTitle = {
          ...mockListPickerContent,
          [fieldKey]: longTitle,
      };
      renderElement({ ...mockProps, content: listPickerLongTitle });
      expect(() => screen.getByText(longTitle)).toThrow(
          "Unable to find an element"
      );
      expect(() => screen.getByText(truncatedTitle)).not.toThrow();
  });

  it.each([
      ["title", LIST_PICKER_CONSTRAINTS.elementTitleCharLimit],
      ["subtitle", LIST_PICKER_CONSTRAINTS.elementSubtitleCharLimit],
  ])("should truncate an element %s over the character limit", (fieldKey, charLimit) => {
      const longElementTitle = "LongElementTitle".repeat(100);
      const truncatedElementTitle = `${longElementTitle.substring(0, charLimit)}...`;

      const listPickerPickerLongTitle = {
          ...mockListPickerContent,
          elements: [...mockListPickerContent.elements, {
            ...mockListPickerContent.elements[0],
            [fieldKey]: longElementTitle
          }]
      };
      renderElement({ ...mockProps, content: listPickerPickerLongTitle });
      expect(() => screen.getByText(longElementTitle)).toThrow(
          "Unable to find an element"
      );
      expect(() => screen.getByText(truncatedElementTitle)).not.toThrow();

      // Should still send entire title to backend, instead of returning 'my selectio...'
      fireEvent.click(screen.getByText(truncatedElementTitle));
      expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
      expect(mockProps.addMessage).toHaveBeenCalledWith({
        text: listPickerPickerLongTitle.elements[listPickerPickerLongTitle.elements.length - 1]["title"],
      });
  });
});

describe("ListPicker XSS Mitigation", () => {
  let mockProps;
  const mockListPickerXSSContent = {
    title: 'Title with script <script>alert("XSS attack!");</script>',
    subtitle: '<img src="x" onerror="alert(\'XSS attack!\');">',
    elements: [
      {
        title: '<a href="javascript:alert(\'XSS attack!\')">Click me</a>',
        subtitle: "Subtitle with script! <script>alert(\"XSS attack!\");</script>",
      },
      {
        title: '<input type="text" value="XSS attack!" onfocus="alert(\'XSS attack!\');">',
        subtitle: "Subtitle with script! <script>alert(\"XSS attack!\");</script>",
      },
      {
        title: '<div data-value="<img src=x onerror=alert(\'XSS attack!\')>"></div>',
        subtitle: "Subtitle with script! <script>alert(\"XSS attack!\");</script>",
      },
      {
        title: '<div style="background-image: url(\'javascript:alert(\'XSS attack!\');\')"></div>',
        subtitle: "Subtitle with script! <script>alert(\"XSS attack!\");</script>",
      }
    ],
  };
  beforeEach(() => {
    mockProps = {
      content: mockListPickerXSSContent,
      addMessage: jest.fn(),
      templateType: InteractiveMessageType.LIST_PICKER,
    };
  });
  function renderElement(props) {
    return render(
      <ThemeProvider>
        <ListPicker {...props} />
      </ThemeProvider>
    );
  }

  it("should use DOMPurify to mitigate malicious XSS input", () => {
    renderElement(mockProps);
    expect(screen.getByText("Title with script")).toBeDefined();
    expect(screen.getByText("<img src=\"x\">", { exact: false })).toBeDefined();
    expect(screen.getByText("<a>Click me</a>", { exact: false })).toBeDefined();
    expect(screen.getByText("<input value=\"XSS attack!\" type=\"text\">", { exact: false })).toBeDefined();
    expect(screen.getByText("<div data-value=\"<img src=x onerror=alert('XSS attack!')>\"></div>", { exact: false })).toBeDefined();
    expect(screen.getByText("<div style=\"background-image: url('javascript:alert('XSS attack!');')\"></div>", { exact: false })).toBeDefined();
  });
});


describe("ListPicker with action buttons test", () => {
  let mockProps;
  const mockListPickerContent = {
    title: "ListPickerTitle",
    subtitle: "ListPickerSubtitle",
    preIndex: "preIndex",
    nextIndex: "nextIndex",
    listId: "listId",
    referenceId: "referenceId",
    elements: [
      {
        title: "Previous options",
        actionDetail: INTERACTIVE_MESSAGE.ACTIONS.PREVIOUS_OPTIONS,
      },
      {
        title: "AnotherListPickerElementTitle1",
        subtitle: "AnotherListPickerElementSubtitle1",
        imageData: "AnotherListPickerElementImageData1",
        imageDescription: "AnotherListPickerElementImageDescription1",
      },
      {
        title: "AnotherListPickerElementTitle2",
        subtitle: "AnotherListPickerElementSubtitle2",
        imageData: "AnotherListPickerElementImageData2",
        imageDescription: "AnotherListPickerElementImageDescription2",
      },
      {
        title: "Show more",
        actionDetail: INTERACTIVE_MESSAGE.ACTIONS.SHOW_MORE,
      },
    ],
    imageData: "ListPickerImageData",
    imageDescription: "ListPickerImageDescription",
  };
  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = {
      content: mockListPickerContent,
      addMessage: addMessage,
      templateType: InteractiveMessageType.LIST_PICKER,
    };
  });
  function renderElement(props) {
    return render(
      <ThemeProvider>
        <ListPicker {...props} />
      </ThemeProvider>
    );
  }
  it("should be able to use action buttons in list picker", () => {
    renderElement(mockProps);
    expect(screen.getByText("Previous options")).toBeDefined();
    expect(screen.getByText("Show more")).toBeDefined();
    expect(screen.getByTestId("listElement0")).toHaveStyle(
      "justify-content: center"
    );
    expect(screen.getByTestId("listElement1")).toHaveStyle(
      "justify-content: flex-start"
    );
    expect(screen.getByTestId("listElement3")).toHaveStyle(
      "justify-content: center"
    );
    fireEvent.click(screen.getByText("Previous options"));
    expect(mockProps.addMessage).toBeCalledWith({
      text: '{"version":"1.0","data":{"actionName":"PREVIOUS_OPTIONS","preIndex":"preIndex","nextIndex":"nextIndex","listId":"listId","templateType":"ListPicker","referenceId":"referenceId"},"action":"PREVIOUS_OPTIONS"}',
      type: "application/vnd.amazonaws.connect.message.interactive.response",
    });
    fireEvent.click(screen.getByText("Show more"));
    expect(mockProps.addMessage).toBeCalledWith({
      text: '{"version":"1.0","data":{"actionName":"SHOW_MORE","preIndex":"preIndex","nextIndex":"nextIndex","listId":"listId","templateType":"ListPicker","referenceId":"referenceId"},"action":"SHOW_MORE"}',
      type: "application/vnd.amazonaws.connect.message.interactive.response",
    });
  });
});
