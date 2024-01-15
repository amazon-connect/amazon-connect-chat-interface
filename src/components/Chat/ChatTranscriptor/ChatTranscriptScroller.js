// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useState, useEffect } from "react";
import PT from "prop-types";
import styled from "styled-components";
import { defaultTheme } from "../../../theme";

import { Text, Loader } from "connect-core";
import { usePrevious } from "connect-hooks";

import {
  MessageBox
} from "./ChatMessages/ChatMessage";

const ScrollContainer = styled.div`
  overflow: auto;
`;

const SCROLL_BOTTOM_MARGIN = 20;
const SCROLL_TOP_MARGIN = 0;

export const LoaderWrapper = styled(MessageBox) `
  width: 80%;
  text-align: center;
  transition: 100ms;
  font-size: 0.8em;
  margin: 0 auto;
`;

ChatTranscriptScroller.propTypes = {
  contactId: PT.string.isRequired,
  loadPreviousTranscript: PT.func,
  lastSentMessageId: PT.string
};
ChatTranscriptScroller.defaultProps = {
  loadPreviousTranscript: () => Promise.resolve(),
  lastSentMessageId: ''
};
export default function ChatTranscriptScroller({
  contactId,
  lastSentMessageId,
  loadPreviousTranscript,
  className,
  children,
  lastReceivedMessageId
}) {
  const ref = useRef(null);

  const prevChildren = usePrevious(children);
  const prevLastSentMessageId = usePrevious(lastSentMessageId);
  const prevLastReceivedMessageId = usePrevious(lastReceivedMessageId);

  const [loading, setLoading] = useState(false);

  // Stores the scroll position during transcript loading
  const [loadingScrollPos, setLoadingScrollPos] = useState(null);

  // Stored scroll positions for different contactIds
  const [contactScrollStore, setContactScrollStore] = useState({});

  const lockedToBottom = ref && ref.current
    ? ref.current.scrollHeight - ref.current.clientHeight <= ref.current.scrollTop + SCROLL_BOTTOM_MARGIN
    : true;

  function isValidScrollTop(scrollTop) {
    return scrollTop !== undefined && (
      scrollTop <= ref.current.scrollHeight - ref.current.clientHeight || scrollTop < 0
    );
  }

  const maxScrollTop = () =>
    ref.current.scrollHeight - ref.current.clientHeight;

  const preLoadingScrollTop = () =>
    ref.current.scrollHeight - loadingScrollPos;

  const shouldScrollToBottom = () =>
    // Scroll down if we are either locked to bottom or have sent a new message
    lockedToBottom || lastSentMessageId !== prevLastSentMessageId;
  const isNewMessageReceived = lastReceivedMessageId !== prevLastReceivedMessageId;

  const shouldRestorePreLoadingScrollTop = () =>
    children !== prevChildren && loading && loadingScrollPos;

  useEffect(() => {
    const scrollTop = contactScrollStore[contactId];
    if (isValidScrollTop(scrollTop)) {
      ref.current.scrollTop = scrollTop < 0 ? maxScrollTop() : scrollTop;
      setContactScrollStore(contactScrollStore => ({...contactScrollStore, [contactId]: undefined}));
    } else if (shouldScrollToBottom()) {
      ref.current.scrollTop = maxScrollTop();
    } else if (shouldRestorePreLoadingScrollTop()) {
      ref.current.scrollTop = preLoadingScrollTop();
      setLoadingScrollPos(null);
    } else if(isNewMessageReceived) {
      onJumpToNewMessage();
    }
  });

  useEffect(() => {
    // When loading has started, we store the scroll position from bottom
    if (loading) {
      setLoadingScrollPos(ref.current.scrollHeight - ref.current.scrollTop);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      // When leaving a tab, we store scroll position or -1 if scrolled all the way down
      const scrolledToBottom = maxScrollTop() <= ref.current.scrollTop + SCROLL_BOTTOM_MARGIN;
      const scrollTop = scrolledToBottom ? -1 : ref.current.scrollTop;
      setContactScrollStore(contactScrollStore => ({...contactScrollStore, [contactId]: scrollTop}));
    };
  }, [contactId]);

  function handleScroll() {
    // Start loading transcript if scrolled all the way up
    const startLoading = ref.current.scrollHeight > ref.current.clientHeight && ref.current.scrollTop <= SCROLL_TOP_MARGIN && !loading;
    if (startLoading) {
      setLoading(true);
      loadPreviousTranscript().then(() => {
        setLoading(false);
      });
    }
  }
  const onJumpToNewMessage = () => {
    ref.current.scrollTo({left:0, top: ref.current.scrollHeight, behavior: "smooth"});
  };

  return (
    <ScrollContainer ref={ref} onScroll={handleScroll} className={className}>
      { loading &&
        <LoaderWrapper>
          <Loader size={20} color={defaultTheme.color.primary} />
          <Text>
            <span>
              Loading previous messages...
            </span>
          </Text>
        </LoaderWrapper>
      }
      { children }
    </ScrollContainer>
  );
}
