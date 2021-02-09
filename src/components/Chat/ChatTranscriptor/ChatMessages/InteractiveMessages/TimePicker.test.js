// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { render, fireEvent } from "@testing-library/react"
import { InteractiveMessageType } from "../../../datamodel/Model";
import { ThemeProvider } from "../../../../../theme";
import TimePicker from "./TimePicker";
 
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

let mockTimePicker;
let mockProps;
 
function renderElement(props) {
    mockTimePicker = render(
        <ThemeProvider>
            <TimePicker {...props}/>
        </ThemeProvider>
    );
}
 
beforeEach(()=>{
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = {content: mockTimePickerContent, addMessage: addMessage};
    process.env.TZ = "UTC"

});
 
afterEach(() => {
    jest.clearAllMocks();
});
 
test("Style should match the snapshot", () => {
    renderElement(mockProps);
    expect(mockTimePicker).toMatchSnapshot();
});
 
test("Should be able to select a date", () => {
    renderElement(mockProps);
    expect(mockTimePicker.getByText("Saturday, October 31")).toBeDefined();
    expect(mockTimePicker.getByText("5:00 PM UTC")).toBeDefined();
    fireEvent.click(mockTimePicker.getByTestId("time-picker-next-date-button"));
    expect(mockTimePicker.getByText("Sunday, November 15")).toBeDefined();
    expect(mockTimePicker.getByText("1:00 PM UTC")).toBeDefined();
    expect(mockTimePicker.getByText("4:00 PM UTC")).toBeDefined();
});
 
test("Should be able to select and reset time", () => {
    renderElement(mockProps);
    fireEvent.click(mockTimePicker.getByText("5:00 PM UTC"));
    expect(mockTimePicker.getByTestId("time-picker-reset-selection-button")).toBeDefined();
    expect(mockTimePicker.getByTestId("time-picker-confirm-selection-button")).toBeDefined();
    fireEvent.click(mockTimePicker.getByTestId("time-picker-reset-selection-button"));
    expect(mockTimePicker.queryByTestId("time-picker-confirm-selection-button")).toBeNull();
});
 
test("Should be able to confirm the time", () => {
    renderElement(mockProps);
    fireEvent.click(mockTimePicker.getByText("5:00 PM UTC"));
    fireEvent.click(mockTimePicker.getByTestId("time-picker-confirm-selection-button"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({text: "2020-10-31T17:00+00:00"});
});
 
test("Should be able to render time options for a specific timezone", () => {
    const mockToLocaleTimeString = jest.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("7:00 AM PDT");
    renderElement(mockProps);
    expect(mockToLocaleTimeString).toHaveBeenCalledTimes(1);
    expect(mockTimePicker.getByText("Saturday, October 31")).toBeDefined();
    expect(mockTimePicker.getByText("7:00 AM PDT")).toBeDefined();
});