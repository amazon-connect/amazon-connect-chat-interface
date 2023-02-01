// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

/**
 * Create anchor tag for plain text urls or rich text hyperlinks, with dynamic target attribute.
 */
export default function RichLinkRenderer(props) {
  const urlAttributeOverrides = {}

  const parseInputRichLinks = (plainTextStr) => {
    let psuedoMarkdownStripped = plainTextStr

    // Match: [amazon.com](https://www.amazon.com){:target=\"_blank\"}
    const PSEUDO_HYPERLINK_MATCH = /\[[0-9A-Za-z?:./=&]+\]\([0-9A-Za-z?:./=&]+\)\{:target="(_self|_blank)"\}/g
    const richLinksFound = plainTextStr.match(PSEUDO_HYPERLINK_MATCH) || [];
    richLinksFound.forEach((match) => {
      const [hyperlink, textToRender, fullUrl, anchorTarget] = match.match(/\[(.+)\]\((.+)\){:target="(.+)"}/);

      urlAttributeOverrides[fullUrl] = {
        linkText: textToRender,
        target: anchorTarget
      }

      psuedoMarkdownStripped = psuedoMarkdownStripped.replace(hyperlink, fullUrl)
    })

    return psuedoMarkdownStripped
  }

  const LinkRenderer = (props) => {
    const customAttributes = urlAttributeOverrides[props.href];
    const linkText = customAttributes ? customAttributes.linkText : props.children
    if (customAttributes && customAttributes.target === '_self') {
      return <a href={props.href}>{linkText}</a>
    }

    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">{linkText}</a>
    )
  }

  return (
    <ReactMarkdown linkTarget={'_blank'} components={{ a: LinkRenderer }} remarkPlugins={[remarkGfm]}>
      {parseInputRichLinks(props.children)}
    </ReactMarkdown>
  )
};
