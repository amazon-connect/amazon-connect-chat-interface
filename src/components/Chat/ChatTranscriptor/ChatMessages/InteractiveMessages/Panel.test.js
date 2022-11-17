// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { render, fireEvent } from "@testing-library/react"
import { InteractiveMessageType } from "../../../datamodel/Model";
import { ThemeProvider } from "../../../../../theme";
import Panel from "./Panel";
 
const mockPanelContent = {
    title: "PanelTitle https://www.amazon.com/",
    subtitle: "PanelSubTitle https://www.amazon.com/",
    elements: [
        {
            title: "PanelElementTitle",
            subtitle: "PanelElementSubTitle",
        },
        {
            title: "AnotherPanelElementTitle",
            subtitle: "AnotherPanelElementSubtitle",
        }
    ],
    imageData: "PanelImageData",
    imageDescription: "PanelImageDescription"
};
 
let mockPanel;
let mockProps;
 
function renderElement(props) {
    mockPanel = render(
        <ThemeProvider>
            <Panel {...props}/>
        </ThemeProvider>
    );
}
 
beforeEach(()=>{
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = {content: mockPanelContent, addMessage: addMessage};
});
 
test("Style should match the snapshot", () => {
    renderElement(mockProps);
    expect(mockPanel).toMatchSnapshot();
});
 
test("Should be able to use Panel", () => {
    renderElement(mockProps);
 
    expect(mockPanel.getByText("PanelTitle")).toBeDefined();
    expect(mockPanel.getByAltText("PanelImageDescription")).toBeDefined();

    expect(mockPanel.getByText("PanelTitle").innerHTML).toEqual(
        "PanelTitle <a href=\"https://www.amazon.com/\" target=\"_blank\">https://www.amazon.com/</a>"
    );
    expect(mockPanel.getByText("PanelSubTitle").innerHTML).toEqual(
        "PanelSubTitle <a href=\"https://www.amazon.com/\" target=\"_blank\">https://www.amazon.com/</a>"
    );
 
    expect(mockPanel.getByText("PanelElementTitle")).toBeDefined();
    expect(mockPanel.getByText("AnotherPanelElementTitle")).toBeDefined();
 
    fireEvent.click(mockPanel.getByText("PanelElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({text: "PanelElementTitle"});
});