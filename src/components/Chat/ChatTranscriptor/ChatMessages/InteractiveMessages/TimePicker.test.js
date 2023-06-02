// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { screen, render, fireEvent } from "@testing-library/react"
import { InteractiveMessageType } from "../../../datamodel/Model";
import { ThemeProvider } from "../../../../../theme";
import TimePicker from "./TimePicker";
import * as helpers from '../../../../../utils/helper';

const TIME_PICKER_CONSTRAINTS = helpers.INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.TIME_PICKER];

const mockTimePickerContent = {
    title: "TimePickerTitle",
    subtitle: "TimePickerSubtitle",
    timeslots: [
        {
            date: "2020-10-31T17:00+00:00",
            duration: "60"
        },
        {
            date: "2020-11-15T13:00+00:00",
            duration: "60"
        },
        {
            date: "2020-11-15T16:00+00:00",
            duration: "60"
        }
    ]
};

const mockTimePickerContentWithTimezoneOffset = {
    title: "TimePickerTitle https://www.amazon.com/",
    subtitle: "TimePickerSubtitle https://www.amazon.com/",
    timeZoneOffset: "-30",
    timeslots: [
        {
            date: "2020-10-31T17:00+00:00",
            duration: "60"
        },
        {
            date: "2020-11-15T13:00+00:00",
            duration: "60"
        },
        {
            date: "2020-11-15T16:00+00:00",
            duration: "60"
        }
    ]
};

describe("<TimePicker />", () => {
    let mockProps;

    function renderElement(props) {
        return render(
            <ThemeProvider>
                <TimePicker {...props}/>
            </ThemeProvider>
        );
    }

    beforeEach(()=>{
        const addMessage = jest.fn().mockResolvedValue(undefined);
        mockProps = {content: mockTimePickerContent, addMessage: addMessage};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Style should match the snapshot", () => {
        const mockTimePicker = renderElement(mockProps);
        expect(mockTimePicker).toMatchSnapshot();

        expect(screen.getByText("TimePickerTitle")).toBeDefined()
        expect(screen.getByText("TimePickerSubtitle")).toBeDefined();
    });

    it("should be able to select a date", () => {
        renderElement(mockProps);
        expect(screen.getByText("Saturday, October 31")).toBeDefined();
        expect(screen.getByText("5:00 PM UTC")).toBeDefined();
        fireEvent.click(screen.getByTestId("time-picker-next-date-button"));
        expect(screen.getByText("Sunday, November 15")).toBeDefined();
        expect(screen.getByText("1:00 PM UTC")).toBeDefined();
        expect(screen.getByText("4:00 PM UTC")).toBeDefined();
    });

    it("should be able to select and reset time", () => {
        renderElement(mockProps);
        fireEvent.click(screen.getByText("5:00 PM UTC"));
        expect(screen.getByTestId("time-picker-reset-selection-button")).toBeDefined();
        expect(screen.getByTestId("time-picker-confirm-selection-button")).toBeDefined();
        fireEvent.click(screen.getByTestId("time-picker-reset-selection-button"));
        expect(screen.queryByTestId("time-picker-confirm-selection-button")).toBeNull();
    });

    it("should be able to confirm the time", () => {
        renderElement(mockProps);
        fireEvent.click(screen.getByText("5:00 PM UTC"));
        fireEvent.click(screen.getByTestId("time-picker-confirm-selection-button"));
        expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
        expect(mockProps.addMessage).toHaveBeenCalledWith({text: "2020-10-31T17:00+00:00"});
    });

    it("should be able to apply specified timezone offset", () => {
        mockProps.content = mockTimePickerContentWithTimezoneOffset;
        renderElement(mockProps);
        expect(screen.getByText("Saturday, October 31")).toBeDefined();
        expect(screen.getByText("4:30 PM UTC")).toBeDefined();
        fireEvent.click(screen.getByTestId("time-picker-next-date-button"));
        expect(screen.getByText("Sunday, November 15")).toBeDefined();
        expect(screen.getByText("12:30 PM UTC")).toBeDefined();
        expect(screen.getByText("3:30 PM UTC")).toBeDefined();
    });

    it("should be able to render time options for a specific timezone", () => {
        const mockToLocaleTimeString = jest.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("7:00 AM PDT");
        renderElement(mockProps);
        expect(mockToLocaleTimeString).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Saturday, October 31")).toBeDefined();
        expect(screen.getByText("7:00 AM PDT")).toBeDefined();
    });

    it.each([
        ["title", TIME_PICKER_CONSTRAINTS.titleCharLimit],
        ["subtitle", TIME_PICKER_CONSTRAINTS.subtitleCharLimit]
    ])("should truncate a %s over the character limit", (fieldKey, charLimit) => {
        const longTitle = "LongTitle".repeat(150);
        const truncatedTitle = `${longTitle.substring(0, charLimit)}...`;

        const timePickerLongTitle = {
            ...mockTimePickerContent,
            [fieldKey]: longTitle,
        };
        renderElement({ ...mockProps, content: timePickerLongTitle });
        expect(() => screen.getByText(longTitle)).toThrow(
            "Unable to find an element"
        );
        expect(() => screen.getByText(truncatedTitle)).not.toThrow();
    });
});

describe("TimePicker XSS Mitigation", () => {
    let mockProps;
    const mockTimePickerXSSContent = {
      ...mockTimePickerContent,
      title: 'Title with script <script>alert("XSS attack!");</script>',
      subtitle: '<input type="text" value="XSS attack!" onfocus="alert(\'XSS attack!\');"></input>',
    };
    beforeEach(() => {
      mockProps = {
        content: mockTimePickerXSSContent,
        addMessage: jest.fn(),
        templateType: InteractiveMessageType.TIME_PICKER,
      };
    });
    function renderElement(props) {
      return render(
        <ThemeProvider>
            <TimePicker {...props}/>
        </ThemeProvider>
      );
    }

    it("should use DOMPurify to mitigate malicious XSS input", () => {
      renderElement(mockProps);
      expect(screen.getByText("Title with script")).toBeDefined();
      expect(screen.getByText("<input value=\"XSS attack!\" type=\"text\">", { exact: false })).toBeDefined();
    });
  });