// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeAttrs from 'rehype-attr';

/**
 * Create anchor tag for plain text urls or rich text hyperlinks, with dynamic target attribute.
 */
export default function RichLinkRenderer(props) {
  const StyledWrapper = props.styledElement || React.Fragment;

  const LinkRenderer = (props) => {
    return (
      <a href={props.href} {...(props.target === '_self' ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
        {props.children}
      </a>
    );
  };

  const ParaRenderer = (props) => {
    const REHYPE_ATTRIBUTE_RE = /<!--.+-->/
    const parsedChildren = props.children ? props.children.filter(child => typeof child === 'string' ? !(REHYPE_ATTRIBUTE_RE).test(child) : true) : []
    return (
      <StyledWrapper>
          {parsedChildren}
      </StyledWrapper>
    );
  };

  return (
    <ReactMarkdown
      components={{ a: LinkRenderer, p: ParaRenderer }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeAttrs, { properties: 'attr' }]]}
      children={props.content}
    />
  );
}
