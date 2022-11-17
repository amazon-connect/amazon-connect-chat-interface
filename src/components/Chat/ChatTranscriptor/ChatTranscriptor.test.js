// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react"
import ChatTranscriptor from "./ChatTranscriptor";
import {ATTACHMENT_MESSAGE, ContentType, AttachmentStatus, AttachmentErrorType, PARTICIPANT_MESSAGE} from "../datamodel/Model";
import { ThemeProvider } from "../../../theme";
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

const mockRichMessagingTranscript = [
    {
        id: "italics",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Incoming",
            messageReceiptType: "read"
        },
        MessageMetadata: {
            MessageId: "italics",
            Receipts: [{
                RecipientParticipantId: "RecipientParticipantId",
                DeliverTimestamp : (new Date()).toISOString(),
                ReadTimestamp: (new Date).toISOString(),
            }]
        },
        lastReadReceipt: true,
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: "data"
        }
    },
    {
        id: "bold",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Outgoing",
            messageReceiptType: "delivered"
        },
        MessageMetadata: {
            MessageId: "bold",
            Receipts: [{
                RecipientParticipantId: "RecipientParticipantId",
                DeliverTimestamp : (new Date()).toISOString(),
                ReadTimestamp: (new Date).toISOString(),
            }]
        },
        lastDeliveredReceipt: true,
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: "data"
        }
    },
    {
        id: "numberedList",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Incoming",
        },
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: "data"
        }
    },
    {
        id: "bulletedList",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Outgoing",
            messageReceiptType: "read"
        },
        MessageMetadata: {
            MessageId: "bulletedList",
            Receipts: [{
                RecipientParticipantId: "RecipientParticipantId",
                DeliverTimestamp : (new Date()).toISOString(),
                ReadTimestamp: (new Date).toISOString(),
            }]
        },
        lastReadReceipt: true,
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: 'data'
        }
    },
    {
        id: "hyperLink",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Incoming",
        },
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: "data"
        }
    },
    {
        id: "image",
        type: PARTICIPANT_MESSAGE,
        transportDetails: {
            direction: "Outgoing",
        },
        content: {
            type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
            data: "data"
        }
    }
];
 
const mockAttachmentsTranscript = [
    {
        id: "1234",
        type: ATTACHMENT_MESSAGE,
        transportDetails: {
            direction: "Incoming"
        },
        Attachments: [
            {
                AttachmentId: "1234",
                AttachmentName: "testDownload.pdf",
                ContentType: ContentType.ATTACHMENT_CONTENT_TYPE.PDF,
                Status: AttachmentStatus.APPROVED
            }
        ]
    },
    {
        id: "2210",
        type: ATTACHMENT_MESSAGE,
        transportDetails: {
            direction: "Outgoing",
            error: {
                type: AttachmentErrorType.InternalServerException,
                message: "transport error"
            }
        },
        Attachments: [
            {
                AttachmentId: "2210",
                AttachmentName: "testDownloadError.pdf",
                ContentType: ContentType.ATTACHMENT_CONTENT_TYPE.PDF,
                Status: AttachmentStatus.REJECTED
            }
        ]
    },
    {
        id: "12342",
        type: ATTACHMENT_MESSAGE,
        transportDetails: {
            direction: "Incoming",
        },
        content: {
            name: "name",
            type: "type",
        },
        Attachments: []
    },
];
 
let mockTranscriptor;
let mockProps;
 
function renderElement(props) {
    mockTranscriptor = render(<ThemeProvider>
        <ChatTranscriptor {...props}/>
    </ThemeProvider>,);
}

global.URL.createObjectURL = jest.fn();

beforeEach(()=>{
    global.URL.createObjectURL = jest.fn();
    const downloadAttachment = jest.fn().mockResolvedValue(undefined);
    mockProps = {downloadAttachment: downloadAttachment, contactId: "12344", contactStatus:"connected", customerName: "Customer", transcript: mockAttachmentsTranscript, typingParticipants: [], shouldShowMessageReceipts: true, loadPreviousTranscript: jest.fn(), sendReadReceipt: jest.fn()};
    mockAllIsIntersecting(false);
});
 
test("Should be able to see and download an attachment", () => {
    renderElement(mockProps);
    expect(mockTranscriptor.getByText("testDownload.pdf")).toBeDefined();
    fireEvent.click(mockTranscriptor.getByText("testDownload.pdf"));
    expect(mockProps.downloadAttachment).toHaveBeenCalledTimes(1);
});
 
test("Should not be able to download an rejected attachment", () => {
    renderElement(mockProps);
    expect(mockTranscriptor.getByText("testDownloadError.pdf")).toBeDefined();
    expect(mockTranscriptor.getByText("transport error")).toBeDefined();
    fireEvent.click(mockTranscriptor.getByText("testDownloadError.pdf"));
    expect(mockProps.downloadAttachment).toHaveBeenCalledTimes(0);
});

test("Should send Read Receipts after a message is displayed in the viewport", async () => {
    mockProps.transcript = mockRichMessagingTranscript;
    mockProps.transcript[mockProps.transcript.length - 1].transportDetails = {
        direction: "Incoming",
        participantRole: "CUSTOMER"
    }
    renderElement(mockProps);
    expect(mockProps.sendReadReceipt).not.toHaveBeenCalled();
    mockAllIsIntersecting(true);
    await waitFor(() => {
        expect(mockProps.sendReadReceipt).toHaveBeenCalled();
        expect(mockProps.sendReadReceipt).toHaveBeenCalledTimes(1);
    });
});
