// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { render, fireEvent } from "@testing-library/react"
import { InteractiveMessageType } from "../../../datamodel/Model";
import { ThemeProvider } from "../../../../../theme";
import ListPicker from "./ListPicker";
 
const mockListPickerContent = {
    title: "ListPickerTitle",
    subtitle: "ListPickerSubTitle",
    elements: [
        {
            title: "ListPickerElementTitle",
            subtitle: "ListPickerElementSubtitle",
            imageData: "ListPickerElementImageData",
            imageDescription: "ListPickerElementImageDescription"
        },
        {
            title: "AnotherListPickerElementTitle",
            subtitle: "AnotherListPickerElementSubtitle",
            imageData: "AnotherListPickerElementImageData",
            imageDescription: "AnotherListPickerElementImageDescription"
        }
    ],
    imageData: "ListPickerImageData",
    imageDescription: "ListPickerImageDescription"
};
 
let mockListPicker;
let mockProps;
 
function renderElement(props) {
    mockListPicker = render(
        <ThemeProvider>
            <ListPicker {...props}/>
        </ThemeProvider>
    );
}
 
beforeEach(()=>{
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = {content: mockListPickerContent, addMessage: addMessage};
});
 
test("Style should match the snapshot", () => {
    renderElement(mockProps);
    expect(mockListPicker).toMatchSnapshot();
});
 
test("Should be able to use ListPicker", () => {
    renderElement(mockProps);
 
    expect(mockListPicker.getByText("ListPickerTitle")).toBeDefined();
    expect(mockListPicker.getByAltText("ListPickerImageDescription")).toBeDefined();
 
    expect(mockListPicker.getByText("ListPickerElementTitle")).toBeDefined();
    expect(mockListPicker.getByText("AnotherListPickerElementTitle")).toBeDefined();
    expect(mockListPicker.getByAltText("ListPickerElementImageDescription")).toBeDefined();
    expect(mockListPicker.getByAltText("AnotherListPickerElementImageDescription")).toBeDefined();
 
    fireEvent.click(mockListPicker.getByText("ListPickerElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({text: "ListPickerElementTitle"});
});