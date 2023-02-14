// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
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
    },
  ],
  imageData: "PanelImageData",
  imageDescription: "PanelImageDescription",
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
    mockProps = { content: mockPanelContent, addMessage: addMessage };
  });

  it("Style should match the snapshot", () => {
    const mockPanel = renderElement(mockProps);
    expect(mockPanel).toMatchSnapshot();
  });

  it("Should be able to use Panel", () => {
    renderElement(mockProps);

    expect(screen.getByText("PanelTitle")).toBeDefined();
    expect(screen.getByAltText("PanelImageDescription")).toBeDefined();

    expect(screen.getByText("PanelTitle").innerHTML).toEqual(
      'PanelTitle <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
    );
    expect(screen.getByText("PanelSubTitle").innerHTML).toEqual(
      'PanelSubTitle <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
    );

    expect(screen.getByText("PanelElementTitle")).toBeDefined();
    expect(screen.getByText("AnotherPanelElementTitle")).toBeDefined();

    fireEvent.click(screen.getByText("PanelElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: "PanelElementTitle",
    });
  });

  it.each([
    ["**MyBoldTitle**", "MyBoldTitle", "strong"],
    ["__MyBoldTitle__", "MyBoldTitle", "strong"],
    ["*MyItalicsTitle*", "MyItalicsTitle", "em"],
    ["_MyItalicsTitle_", "MyItalicsTitle", "em"],
  ])(
    "should detect and format rich formatting",
    (richText, plainText, expectedElem) => {
      mockProps.content = Object.create(mockPanelContent);
      mockProps.content.title = richText;
      renderElement(mockProps);
      const elem = screen.getByText(plainText);
      expect(elem).toBeDefined();
      expect(elem.parentElement.innerHTML).toEqual(
        `<${expectedElem}>${plainText}</${expectedElem}>`,
      );
    },
  );
});
