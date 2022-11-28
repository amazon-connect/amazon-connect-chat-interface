var contactFlowId = "12345678-1234-1234-1234-123456789012"; // TODO: Fill in
var instanceId = "12345678-1234-1234-1234-123456789012"; // TODO: Fill in
var apiGatewayEndpoint = "https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/"; // TODO: Fill in with the API Gateway endpoint created by your CloudFormation template
var region = "us-west-2"; // TODO: Fill in

var initConfig = {
    name: "John",
    region,
    apiGatewayEndpoint,
    contactAttributes: JSON.stringify({
        "customerName": "John"
    }),
    contactFlowId,
    instanceId
}