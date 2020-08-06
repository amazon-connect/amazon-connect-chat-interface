import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { addLocaleData, IntlProvider } from "react-intl";

describe("<App />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <IntlProvider locale="en">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IntlProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
