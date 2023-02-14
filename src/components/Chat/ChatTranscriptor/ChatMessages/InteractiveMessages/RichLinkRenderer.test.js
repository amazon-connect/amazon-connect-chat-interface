// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import RichLinkRenderer from "./RichLinkRenderer";

const MOCK_TITLE = "TestTitle";
const PLAIN_LINK = {
  outputText: "TestTitle",
  richText: "https://www.amazon.com/",
  expectedHTML:
    '<a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">https://www.amazon.com/</a>',
};
const RICH_LINK_DEFAULT = {
  outputText: "amazon.com",
  richText: "[amazon.com](https://www.amazon.com/)",
  expectedHTML:
    '<a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">amazon.com</a>',
};
const RICH_LINK_CUSTOM_ATTRIBUTE = {
  outputText: "amazon.com",
  richText: '[amazon.com](https://amazon.com/)<!--rehype:target=_self-->',
  expectedHTML: '<a href="https://amazon.com/">amazon.com</a>',
};

describe("<RichLinkRenderer />", () => {
  function renderElement(mockRichText) {
    return render(
      <ThemeProvider>
        <RichLinkRenderer content={mockRichText} />
      </ThemeProvider>,
    );
  }

  it("should detect plain text url and create anchor", () => {
    renderElement(`${MOCK_TITLE} ${PLAIN_LINK.richText}`);

    expect(screen.getByText(PLAIN_LINK.outputText)).toBeDefined();
    expect(screen.getByText(MOCK_TITLE).innerHTML).toEqual(
      `${MOCK_TITLE} ${PLAIN_LINK.expectedHTML}`,
    );
  });

  it("should detect rich link hyperlink and create anchor", () => {
    renderElement(`${MOCK_TITLE} ${RICH_LINK_DEFAULT.richText}`);

    expect(screen.getByText(MOCK_TITLE)).toBeDefined();
    expect(screen.getByText(MOCK_TITLE).innerHTML).toEqual(
      `${MOCK_TITLE} ${RICH_LINK_DEFAULT.expectedHTML}`,
    );
  });

  it("should set custom target attribute for rich text hyperlink", () => {
    renderElement(`${MOCK_TITLE} ${RICH_LINK_CUSTOM_ATTRIBUTE.richText}`);

    expect(screen.getByText(MOCK_TITLE, { exact: false })).toBeDefined();
    expect(screen.getByText(MOCK_TITLE, { exact: false }).innerHTML).toEqual(
      `${MOCK_TITLE} ${RICH_LINK_CUSTOM_ATTRIBUTE.expectedHTML}`,
    );
  });

  it("should set custom target attribute for multiple rich text hyperlinks", () => {
    renderElement(
      `${MOCK_TITLE} ${RICH_LINK_DEFAULT.richText} - ${RICH_LINK_CUSTOM_ATTRIBUTE.richText}`,
    );

    expect(screen.getByText(MOCK_TITLE, { exact: false })).toBeDefined();
    expect(screen.getByText(MOCK_TITLE, { exact: false }).innerHTML).toEqual(
      `${MOCK_TITLE} ${RICH_LINK_DEFAULT.expectedHTML} - ${RICH_LINK_CUSTOM_ATTRIBUTE.expectedHTML}`,
    );
  });

  it.each([
    {
      richText: `**${MOCK_TITLE}**`,
      expectedHTML: `<strong>${MOCK_TITLE}</strong>`,
    },
    {
      richText: `__${MOCK_TITLE}__`,
      expectedHTML: `<strong>${MOCK_TITLE}</strong>`,
    },
    {
      richText: `before**${MOCK_TITLE}**after`,
      expectedHTML: `before<strong>${MOCK_TITLE}</strong>after`,
    },
    { richText: `*${MOCK_TITLE}*`, expectedHTML: `<em>${MOCK_TITLE}</em>` },
    { richText: `_${MOCK_TITLE}_`, expectedHTML: `<em>${MOCK_TITLE}</em>` },
    {
      richText: `before*${MOCK_TITLE}*after`,
      expectedHTML: `before<em>${MOCK_TITLE}</em>after`,
    },
  ])(
    "should detect and render bold and italics text",
    ({ richText, expectedHTML }) => {
      renderElement(richText);

      const formattedElem = screen.getByText(MOCK_TITLE, { exact: false });
      expect(formattedElem.parentElement.innerHTML).toEqual(expectedHTML);
    },
  );

  // TODO: support formatting a rich link
  // [PLAIN_LINK, RICH_LINK_DEFAULT, RICH_LINK_CUSTOM_ATTRIBUTE].forEach(({ outputText, richText, expectedHTML }) => {
  //     it.each([
  //         [`**${richText}**`, "strong"],
  //         [`__${richText}__`, "strong"],
  //         [`*${richText}*`, "em"],
  //         [`_${richText}_`, "em"],
  //      ])("should detect and format rich link: %s", ([richText, expectedParent]) => {
  //         renderElement(richText);
  //          const formattedElem = screen.getByText(outputText, { exact: false });
  //          expect(formattedElem.closest(expectedParent)).toBeTruthy();
  //          expect(formattedElem.parentElement.innerHTML).toEqual(expectedHTML);
  //      });
  // });
});
