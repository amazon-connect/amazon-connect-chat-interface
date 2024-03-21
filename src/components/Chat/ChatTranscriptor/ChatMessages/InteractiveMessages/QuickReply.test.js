// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import QuickReply from "./QuickReply";
import { InteractiveMessageType } from "../../../datamodel/Model";
import * as helpers from '../../../../../utils/helper';

const QUICK_REPLY_CONSTRAINTS = helpers.INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.QUICK_REPLY];

export const mockQuickReplyContent = {
  title: "How was your experience?",
  elements: [
    {
      title: "Great!",
    },
    {
      title: "Good",
    },
    {
      title: "Ok",
    },
    {
      title: "Poor",
    },
    {
      title: "Terrible!",
    },
  ],
};

describe("<QuickReply />", () => {
  let mockProps;

  function renderElement(props) {
    return render(
      <ThemeProvider>
        <QuickReply {...props} />
      </ThemeProvider>
    );
  }
  window.connect = {
    csmService: {
      addCountMetric: jest.fn().mockImplementation(() => {}),
    }
  }
  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockQuickReplyContent, addMessage: addMessage };
  });

  it("Style should match the snapshot", () => {
    const mockQuickReply = renderElement(mockProps);
    expect(mockQuickReply).toMatchSnapshot();
  });

  it("Should include all necessary data-testid values for integ/canary tests", () => {
    renderElement(mockProps);

    expect(screen.getByTestId("interactive-quickreply-message-title")).toBeInTheDocument();
    expect(screen.getByTestId("interactive-quickreply-response-section")).toBeInTheDocument();
  });

  it("Should be able to use QuickReply", () => {
    renderElement(mockProps);

    // Renders title
    expect(screen.getByText(mockQuickReplyContent.title)).toBeDefined();

    // Renders each element
    mockQuickReplyContent.elements.forEach(({ title: replyOption }) => {
      expect(screen.getByText(replyOption)).toBeDefined();
    });

    // Can click an option
    const replyToChoose = mockQuickReplyContent.elements[0].title;
    fireEvent.click(screen.getByText(replyToChoose));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: replyToChoose,
    });
  });

  it("Should render all reply options and be accessible", () => {
    renderElement(mockProps)

    const responseSectionDiv = screen.getByTestId("interactive-quickreply-response-section");
    const buttons = responseSectionDiv.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(button => {
      // Check that the button is accessible to screen readers
      expect(button).toHaveAccessibleName();
      button.click();
      expect(button).toBeEnabled();
    });
  });

  it("Should truncate a title over the character limit", () => {
    const { titleCharLimit } = QUICK_REPLY_CONSTRAINTS;

    const longTitle = "LongTitle".repeat(100);
    const truncatedTitle = `${longTitle.substring(0, titleCharLimit)}...`;

    const quickReplyLongTitle = {
      ...mockQuickReplyContent,
      title: longTitle,
    };
    renderElement({ ...mockProps, content: quickReplyLongTitle });
    expect(() => screen.getByText(longTitle)).toThrow(
      "Unable to find an element"
    );
    expect(() => screen.getByText(truncatedTitle)).not.toThrow();
  });

  it("Should truncate a picker option over the character limit", () => {
    const { replyOptionCharLimit } = QUICK_REPLY_CONSTRAINTS;

    const longPickerOption = "LongPickerOption".repeat(100);
    const truncatedPickerOption = `${longPickerOption.substring(0, replyOptionCharLimit)}...`;
    const shortPickerOption = "Under the char limit!";

    const quickReplyLongOption = {
      ...mockQuickReplyContent,
      elements: [{ title: shortPickerOption }, { title: longPickerOption }],
    };

    renderElement({ ...mockProps, content: quickReplyLongOption });
    expect(() => screen.getByText(longPickerOption)).toThrow(
      "Unable to find an element"
    );
    expect(() => screen.getByText(truncatedPickerOption)).not.toThrow();
    expect(() => screen.getByText(shortPickerOption)).not.toThrow();

    // Should still send entire title to backend, instead of returning 'my selectio...'
    fireEvent.click(screen.getByText(truncatedPickerOption));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: longPickerOption,
    });
  });
});

describe("QuickReply XSS Mitigation", () => {
  let mockProps;
  const mockQuickReplyXSSContent = {
    title: 'Title with script <script>alert("XSS attack!");</script>',
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
      content: mockQuickReplyXSSContent,
      addMessage: jest.fn(),
      templateType: InteractiveMessageType.QUICK_REPLY,
    };
  });
  function renderElement(props) {
    return render(
      <ThemeProvider>
        <QuickReply {...props} />
      </ThemeProvider>
    );
  }

  it("should use DOMPurify to mitigate malicious XSS input", () => {
    renderElement(mockProps);
    expect(screen.getByText("Title with script")).toBeDefined();
    expect(screen.getByText("<a>Click me</a>", { exact: false })).toBeDefined();
    expect(screen.getByText("<input value=\"XSS attack!\" type=\"text\">", { exact: false })).toBeDefined();
    expect(screen.getByText("<div data-value=\"<img src=x onerror=alert('XSS attack!')>\"></div>", { exact: false })).toBeDefined();
    expect(screen.getByText("<div style=\"background-image: url('javascript:alert('XSS attack!');')\"></div>", { exact: false })).toBeDefined();
  });
});