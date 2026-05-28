import { ConnectClient, StartChatContactCommand } from "@aws-sdk/client-connect";

// Explicit region bypasses environment-discovery delays in Node 24.x Lambda runtime.
const REGION = "ap-southeast-2";
const PARTICIPANT_SERVICE_ENDPOINT = `https://participant.connect.${REGION}.amazonaws.com`;

// CORS headers are defined once and applied to EVERY return path so the browser
// network panel never masks execution errors behind a generic CORS failure.
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-Bearer",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json"
};

// Client is instantiated at module scope for connection reuse across warm invocations.
const connectClient = new ConnectClient({ region: REGION });

export const handler = async (event) => {
    console.log("Incoming request:", JSON.stringify({
        httpMethod: event.httpMethod,
        path: event.path,
        sourceIp: event.requestContext?.identity?.sourceIp,
        userAgent: event.requestContext?.identity?.userAgent,
        bodyLength: event.body ? event.body.length : 0
    }));

    // ── CORS Preflight ─────────────────────────────────────────────────────────
    if (event.httpMethod === "OPTIONS") {
        console.log("CORS preflight handled.");
        return { statusCode: 200, headers: CORS_HEADERS, body: "" };
    }

    if (event.httpMethod !== "POST") {
        console.warn("Method not allowed:", event.httpMethod);
        return {
            statusCode: 405,
            headers: { ...CORS_HEADERS, "Allow": "POST,OPTIONS" },
            body: JSON.stringify({ error: "Method not allowed." })
        };
    }

    // ── Parse Body ─────────────────────────────────────────────────────────────
    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch (parseErr) {
        console.error("Request body JSON parse failure:", parseErr.message);
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Request body must be valid JSON." })
        };
    }

    const { customerName, customerEmail } = body;

    // ── Input Validation ───────────────────────────────────────────────────────
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 1) {
        console.warn("Validation failed: customerName missing or invalid.");
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "customerName is required and must be a non-empty string." })
        };
    }

    if (!customerEmail || typeof customerEmail !== "string") {
        console.warn("Validation failed: customerEmail missing or not a string.");
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "customerEmail is required." })
        };
    }

    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}$/;
    if (!emailRegex.test(customerEmail.trim())) {
        console.warn("Validation failed: customerEmail format invalid.");
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "customerEmail must be a valid email address." })
        };
    }

    // ── Defensive Server-Side Truncation ───────────────────────────────────────
    // Applied after validation so error messages reflect the original input intent.
    const sanitizedName  = customerName.trim().substring(0, 50);
    const sanitizedEmail = customerEmail.trim().substring(0, 100);

    console.log("Processing chat request. Customer:", sanitizedName, "| Email:", sanitizedEmail);

    // ── Environment Variable Resolution ───────────────────────────────────────
    const instanceId    = process.env.CONNECT_INSTANCE_ID;
    const contactFlowId = process.env.CONNECT_CONTACT_FLOW_ID;

    if (!instanceId || !contactFlowId) {
        console.error(
            "FATAL: Missing required Lambda environment variables.",
            "CONNECT_INSTANCE_ID present:", !!instanceId,
            "CONNECT_CONTACT_FLOW_ID present:", !!contactFlowId
        );
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Server configuration error. Please contact an administrator." })
        };
    }

    // ── StartChatContact ───────────────────────────────────────────────────────
    try {
        const command = new StartChatContactCommand({
            InstanceId:    instanceId,
            ContactFlowId: contactFlowId,
            ParticipantDetails: {
                DisplayName: sanitizedName
            },
            Attributes: {
                customerName:  sanitizedName,
                customerEmail: sanitizedEmail,
                channel:       "WEB_CHAT_WIDGET"
            },
            SupportedMessagingContentTypes: [
                "text/plain",
                "text/markdown"
            ]
        });

        const response = await connectClient.send(command);

        console.log(
            "StartChatContact success.",
            "ContactId:", response.ContactId,
            "| ParticipantId:", response.ParticipantId
        );

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                contactId:                  response.ContactId,
                participantId:              response.ParticipantId,
                participantToken:           response.ParticipantToken,
                participantServiceEndpoint: PARTICIPANT_SERVICE_ENDPOINT
            })
        };

    } catch (awsErr) {
        console.error(
            "StartChatContact AWS SDK error.",
            "Name:", awsErr.name,
            "| Message:", awsErr.message,
            "| RequestId:", awsErr.$metadata?.requestId
        );
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "Failed to initiate chat session. Please try again." })
        };
    }
};
