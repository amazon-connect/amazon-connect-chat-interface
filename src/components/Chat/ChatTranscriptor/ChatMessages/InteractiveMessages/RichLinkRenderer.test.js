// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "../../../../../theme";
import RichLinkRenderer from "./RichLinkRenderer";
 
const MOCK_TITLE = 'TestTitle';
const PLAIN_URL_TEXT = 'https://www.amazon.com/';
const PLAIN_URL_HTML = '<a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">https://www.amazon.com/</a>';
const HYPERLINK_DEFAULT_TEXT = '[amazon.com](https://www.amazon.com/)';
const HYPERLINK_DEFAULT_HTML = '<a href=\"https://www.amazon.com/\" target=\"_blank\" rel=\"noopener noreferrer\">amazon.com</a>';
const HYPERLINK_CUSTOM_TARGET_TEXT = '[amazon.com](https://aws.amazon.com/){:target=\"_self\"}';
const HYPERLINK_CUSTOM_TARGET_HTML = '<a href=\"https://aws.amazon.com/\">amazon.com</a>';

describe('<RichLinkRenderer />', () => {    
    function renderElement(mockchildren) {
        render(
            <ThemeProvider>
                <RichLinkRenderer>
                    {mockchildren}
                </RichLinkRenderer>
            </ThemeProvider>
        );
    }

    test("should detect plain text url and create anchor", () => {
        
        renderElement(`${MOCK_TITLE} ${PLAIN_URL_TEXT}`);

        expect(screen.getByText(MOCK_TITLE)).toBeDefined();
        expect(screen.getByText(MOCK_TITLE).innerHTML).toEqual(`${MOCK_TITLE} ${PLAIN_URL_HTML}`);
    });

    test("should detect rich link hyperlink and create anchor", () => {
        renderElement(`${MOCK_TITLE} ${HYPERLINK_DEFAULT_TEXT}`);
    
        expect(screen.getByText(MOCK_TITLE)).toBeDefined();
        expect(screen.getByText(MOCK_TITLE).innerHTML).toEqual(`${MOCK_TITLE} ${HYPERLINK_DEFAULT_HTML}`);
    });

    test("should set custom target attribute for rich text hyperlink", () => {
        renderElement(`${MOCK_TITLE} ${HYPERLINK_CUSTOM_TARGET_TEXT}`);
    
        expect(screen.getByText(MOCK_TITLE)).toBeDefined();
        expect(screen.getByText(MOCK_TITLE).innerHTML).toEqual(`${MOCK_TITLE} ${HYPERLINK_CUSTOM_TARGET_HTML}`);
    });

    test("should set custom target attribute for multiple rich text hyperlinks", () => {
        renderElement(`${MOCK_TITLE} ${HYPERLINK_DEFAULT_TEXT} - ${HYPERLINK_CUSTOM_TARGET_TEXT}`)
                
        expect(screen.getByText(MOCK_TITLE, { exact: false })).toBeDefined();
        expect(screen.getByText(MOCK_TITLE, { exact: false }).innerHTML).toEqual(`${MOCK_TITLE} ${HYPERLINK_DEFAULT_HTML} - ${HYPERLINK_CUSTOM_TARGET_HTML}`);
    });
});
