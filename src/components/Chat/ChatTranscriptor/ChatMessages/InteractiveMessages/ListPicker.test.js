// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import ListPicker from "./ListPicker";
import { INTERACTIVE_MESSAGE } from "../../../constants";
import "@testing-library/jest-dom/extend-expect";

describe("<ListPicker />", () => {
  const mockListPickerContent = {
    title: "ListPickerTitle https://www.amazon.com/",
    subtitle: "ListPickerSubTitle",
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

  let mockListPicker;
  let mockProps;

  function renderElement(props) {
    mockListPicker = render(
      <ThemeProvider>
        <ListPicker {...props} />
      </ThemeProvider>
    );
  }

  beforeEach(() => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    mockProps = { content: mockListPickerContent, addMessage: addMessage };
  });

  test("Style should match the snapshot", () => {
    renderElement(mockProps);
    expect(mockListPicker).toMatchSnapshot();
  });

  test("Should be able to use ListPicker", () => {
    renderElement(mockProps);

    expect(mockListPicker.getByText("ListPickerTitle")).toBeDefined();
    expect(screen.getByText("ListPickerTitle").innerHTML).toEqual(
      'ListPickerTitle <a href="https://www.amazon.com/" target="_blank">https://www.amazon.com/</a>'
    );
    expect(
      mockListPicker.getByAltText("ListPickerImageDescription")
    ).toBeDefined();

    expect(mockListPicker.getByText("ListPickerElementTitle")).toBeDefined();
    expect(
      mockListPicker.getByText("AnotherListPickerElementTitle")
    ).toBeDefined();
    expect(
      mockListPicker.getByAltText("ListPickerElementImageDescription")
    ).toBeDefined();
    expect(
      mockListPicker.getByAltText("AnotherListPickerElementImageDescription")
    ).toBeDefined();

    fireEvent.click(mockListPicker.getByText("ListPickerElementTitle"));
    expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
    expect(mockProps.addMessage).toHaveBeenCalledWith({
      text: "ListPickerElementTitle",
    });
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
      templateType: "ListPicker",
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
    expect(screen.getByTestId("listElementButton0")).toHaveStyle(
      "justify-content: center"
    );
    expect(screen.getByTestId("listElementButton1")).toHaveStyle(
      "justify-content: flex-start"
    );
    expect(screen.getByTestId("listElementButton3")).toHaveStyle(
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
