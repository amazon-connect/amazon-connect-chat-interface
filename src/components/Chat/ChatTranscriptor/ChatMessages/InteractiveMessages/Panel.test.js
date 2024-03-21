// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { screen, render, fireEvent } from "@testing-library/react";
import { InteractiveMessageType } from "../../../datamodel/Model";
import { ThemeProvider } from "../../../../../theme";
import Panel from "./Panel";
import * as helpers from '../../../../../utils/helper';

const PANEL_CONSTRAINTS = helpers.INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.PANEL];

const mockPanelContent = {
    title: "PanelTitle",
    subtitle: "PanelSubtitle",
    elements: [
        {
            title: "PanelElementTitle",
        },
        {
            title: "AnotherPanelElementTitle",
        }
    ],
    imageData: "PanelImageData",
    imageDescription: "PanelImageDescription"
};

describe("<Panel />", () => {
  let mockProps;

  function renderElement(props) {
    return render(
      <ThemeProvider>
        <Panel {...props} />
      </ThemeProvider>,
    );
  }

  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockPanelContent, addMessage: addMessage, templateType: InteractiveMessageType.PANEL };
  });

  it("Style should match the snapshot", () => {
    const mockPanel = renderElement(mockProps);
    expect(mockPanel).toMatchSnapshot();
  });

  it("Should be able to use Panel", () => {
    renderElement(mockProps);

    expect(screen.getByText("PanelTitle")).toBeDefined()
    expect(screen.getByText("PanelSubtitle")).toBeDefined();
    expect(screen.getByAltText("PanelImageDescription")).toBeDefined();
    expect(screen.getByText("PanelElementTitle")).toBeDefined();
    expect(screen.getByText("AnotherPanelElementTitle")).toBeDefined();

    fireEvent.click(screen.getByText("PanelElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: "PanelElementTitle",
    });
  });

  it("Should create interactive selection message payload", () => {
    renderElement(mockProps);

    const createMsgPayloadSpy = jest.spyOn(helpers, 'createInteractiveMessagePayload');
    fireEvent.click(screen.getByText("PanelElementTitle"));
    expect(createMsgPayloadSpy).toHaveBeenCalledWith({"title": "PanelElementTitle"}, undefined, undefined, undefined, InteractiveMessageType.PANEL, undefined, undefined, "PanelTitle", undefined);

    createMsgPayloadSpy.mockRestore();
  });

  it.each([
      ["title", PANEL_CONSTRAINTS.titleCharLimit],
      ["subtitle", PANEL_CONSTRAINTS.subtitleCharLimit]
  ])("should truncate a %s over the character limit", (fieldKey, charLimit) => {
      const longTitle = "LongTitle".repeat(150);
      const truncatedTitle = `${longTitle.substring(0, charLimit)}...`;

      const panelPickerLongTitle = {
          ...mockPanelContent,
          [fieldKey]: longTitle,
      };
      renderElement({ ...mockProps, content: panelPickerLongTitle });
      expect(() => screen.getByText(longTitle)).toThrow(
          "Unable to find an element"
      );
      expect(() => screen.getByText(truncatedTitle)).not.toThrow();
  });

  it.each([
      ["title", PANEL_CONSTRAINTS.elementTitleCharLimit],
  ])("should truncate an element %s over the character limit", (fieldKey, charLimit) => {
      const longElementTitle = "LongElementTitle".repeat(100);
      const truncatedElementTitle = `${longElementTitle.substring(0, charLimit)}...`;

      const panelPickerLongTitle = {
          ...mockPanelContent,
          elements: [...mockPanelContent.elements, {
            ...mockPanelContent.elements[0],
            [fieldKey]: longElementTitle
          }]
      };
      renderElement({ ...mockProps, content: panelPickerLongTitle });
      expect(() => screen.getByText(longElementTitle)).toThrow(
          "Unable to find an element"
      );
      expect(() => screen.getByText(truncatedElementTitle)).not.toThrow();

      // Should still send entire title to backend, instead of returning 'my selectio...'
      fireEvent.click(screen.getByText(truncatedElementTitle));
      expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
      expect(mockProps.addMessage).toHaveBeenCalledWith({
        text: longElementTitle,
      });
  });
});

describe("Panel XSS Mitigation", () => {
  let mockProps;
  const mockPanelXSSContent = {
    title: 'Title with script <script>alert("XSS attack!");</script>',
    subtitle: '<img src="x" onerror="alert(\'XSS attack!\');">',
    elements: [
      {
        title: '<a href="javascript:alert(\'XSS attack!\')">Click me</a>',
      },
      {
        title: '<input type="text" value="XSS attack!" onfocus="alert(\'XSS attack!\');">',
      },
      {
        title: '<div data-value="<img src=x onerror=alert(\'XSS attack!\')>"></div>',
      },
      {
        title: '<div style="background-image: url(\'javascript:alert(\'XSS attack!\');\')"></div>',
      }
    ],
  };
  beforeEach(() => {
    mockProps = {
      content: mockPanelXSSContent,
      addMessage: jest.fn(),
      templateType: InteractiveMessageType.PANEL,
    };
  });
  function renderElement(props) {
    return render(
      <ThemeProvider>
        <Panel {...props} />
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