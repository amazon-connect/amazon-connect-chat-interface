// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import { screen, render, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "../../../../../theme";
import TimePicker from "./TimePicker";

const mockTimePickerContent = {
    title: "TimePickerTitle https://www.amazon.com/",
    subtitle: "TimePickerSubtitle https://www.amazon.com/",
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


        expect(screen.getByText("TimePickerTitle").innerHTML).toEqual(
            "TimePickerTitle <a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.amazon.com/</a>"
        );
        expect(screen.getByText("TimePickerSubtitle").innerHTML).toEqual(
            "TimePickerSubtitle <a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.amazon.com/</a>"
        );
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

    it("should be able to render time options for a specific timezone", () => {
        const mockToLocaleTimeString = jest.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("7:00 AM PDT");
        renderElement(mockProps);
        expect(mockToLocaleTimeString).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Saturday, October 31")).toBeDefined();
        expect(screen.getByText("7:00 AM PDT")).toBeDefined();
    });

    it("should render and detect links in title/subtitle", () => {
        renderElement(mockProps);

        expect(screen.getByText("TimePickerTitle")).toBeDefined();
        expect(screen.getByText("TimePickerTitle").innerHTML).toEqual(
            "TimePickerTitle <a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.amazon.com/</a>"
        );
        expect(screen.getByText("TimePickerSubtitle").innerHTML).toEqual(
            "TimePickerSubtitle <a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.amazon.com/</a>"
        );
    });

    it.each([
        ["**MyBoldTitle**", "MyBoldTitle", "strong"],
        ["__MyBoldTitle__", "MyBoldTitle", "strong"],
        ["*MyItalicsTitle*", "MyItalicsTitle", "em"],
        ["_MyItalicsTitle_", "MyItalicsTitle", "em"]
    ])("should detect and format rich formatting", (richText, plainText, expectedElem) => {
        mockProps.content = Object.create(mockTimePickerContent);
        mockProps.content.title = richText
        renderElement(mockProps);
        const elem = screen.getByText(plainText);
        expect(elem).toBeDefined();
        expect(elem.parentElement.innerHTML).toEqual(`<${expectedElem}>${plainText}</${expectedElem}>`);
    });
});