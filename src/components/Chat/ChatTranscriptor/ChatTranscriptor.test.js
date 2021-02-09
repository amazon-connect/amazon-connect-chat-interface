import React from 'react';
import { render, fireEvent } from "@testing-library/react"
import ChatTranscriptor from "./ChatTranscriptor";
import {ATTACHMENT_MESSAGE, ContentType, AttachmentStatus, AttachmentErrorType} from "../datamodel/Model";
import { ThemeProvider } from "../../../theme";
 
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
    }
];
 
let mockTranscriptor;
let mockProps;
 
function renderElement(props) {
    mockTranscriptor = render(<ThemeProvider>
        <ChatTranscriptor {...props}/>
    </ThemeProvider>,);
}
 
beforeEach(()=>{
    const downloadAttachment = jest.fn().mockResolvedValue(undefined);
    mockProps = {downloadAttachment: downloadAttachment, contactId: "12344", contactStatus:"connected", customerName: "Customer", transcript: mockAttachmentsTranscript, typingParticipants: []};
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
