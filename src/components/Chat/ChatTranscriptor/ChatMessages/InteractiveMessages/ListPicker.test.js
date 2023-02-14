// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import ListPicker from "./ListPicker";

const mockListPickerContent = {
  title: "ListPickerTitle https://www.amazon.com/",
  subtitle: "ListPickerSubtitle https://www.amazon.com/",
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

describe("<ListPicker />", () => {
  let mockProps;

  function renderElement(props) {
    return render(
      <ThemeProvider>
        <ListPicker {...props} />
      </ThemeProvider>,
    );
  }

  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockListPickerContent, addMessage: addMessage };
  });

  it("style should match the snapshot", () => {
    const mockListPicker = renderElement(mockProps);
    expect(mockListPicker).toMatchSnapshot();
  });

  it("should be able to use ListPicker", () => {
    renderElement(mockProps);

    expect(screen.getByText("ListPickerTitle")).toBeDefined();
    expect(screen.getByText("ListPickerTitle").innerHTML).toEqual(
      'ListPickerTitle <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
    );
    expect(screen.getByAltText("ListPickerImageDescription")).toBeDefined();

    expect(screen.getByText("ListPickerElementTitle")).toBeDefined();
    expect(screen.getByText("AnotherListPickerElementTitle")).toBeDefined();
    expect(
      screen.getByAltText("ListPickerElementImageDescription"),
    ).toBeDefined();
    expect(
      screen.getByAltText("AnotherListPickerElementImageDescription"),
    ).toBeDefined();

    fireEvent.click(screen.getByText("ListPickerElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: "ListPickerElementTitle",
    });
  });

  it("should render and detect links in title/subtitle", () => {
    renderElement(mockProps);

    expect(screen.getByText("ListPickerTitle")).toBeDefined();
    expect(screen.getByText("ListPickerTitle").innerHTML).toEqual(
      'ListPickerTitle <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
    );
    expect(screen.getByText("ListPickerSubtitle").innerHTML).toEqual(
      'ListPickerSubtitle <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
    );
  });

  it.each([
    ["**MyBoldTitle**", "MyBoldTitle", "strong"],
    ["__MyBoldTitle__", "MyBoldTitle", "strong"],
    ["*MyItalicsTitle*", "MyItalicsTitle", "em"],
    ["_MyItalicsTitle_", "MyItalicsTitle", "em"],
  ])(
    "should detect and format rich formatting",
    (richText, plainText, expectedElem) => {
      mockProps.content = Object.create(mockListPickerContent);
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
