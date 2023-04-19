import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { screen } from "@testing-library/dom";
import { InteractiveMessage } from "./InteractiveMessage";

describe("Interactive message", () => {
  const mockProps = {
    content: {
      title: "ListPickerTitle",
      subtitle: "ListPickerSubtitle",
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
    },
    addMessage: jest.fn(),
    textInputRef: React.createRef(),
  };
  function renderComponent(props) {
    render(
      <ThemeProvider>
        <InteractiveMessage {...props} />
      </ThemeProvider>
    );
  }

  it("should render interactive message -> list picker component correctly", () => {
    renderComponent({ ...mockProps, templateType: "ListPicker" });
    expect(screen.getByText("ListPickerElementTitle")).toBeInTheDocument();
  });
  it("should render interactive message -> panel picker component correctly", () => {
    renderComponent({ ...mockProps, templateType: "Panel" });
    expect(screen.getByText("ListPickerElementTitle")).toBeInTheDocument();
  });
  it("should render interactive message -> time picker component correctly", () => {
    const timePickerContent = {
      title: "Schedule appointment",
      subtitle: "Tap to select option",
      timeslots: [
        {
          date: "2024-01-02T00:00+00:00",
          duration: 60,
        },
        {
          date: "2024-01-03T00:00+00:00",
          duration: 60,
        },
        {
          date: "2024-01-04T00:00+00:00",
          duration: 60,
        },
      ],
      location: {
        title: "Oscar",
        latitude: 47.616299,
        longitude: -122.333031,
        radius: 1,
      },
      timeZoneOffset: -420,
    };
    renderComponent({
      ...mockProps,
      templateType: "TimePicker",
      content: timePickerContent,
    });
    expect(screen.getByText("Schedule appointment")).toBeInTheDocument();
  });
});