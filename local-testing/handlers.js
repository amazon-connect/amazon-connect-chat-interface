function successHandler(chatSession) {
    $('#section-chat').fadeIn(400);

    chatSession.onChatDisconnected(function(data) {
        $('#section-chat').hide('slide');
        $("#btn").prop("disabled", false);
    });

    console.log("Joined chat!");
}

// Capture and handle the detected error
function failureHandler(err) {
    $("#btn").prop("disabled", false);
    $('#section-chat').hide();

    console.error("Failed to join chat :(", err);
    alert("Error initiating the chat! - " + JSON.stringify(err));
}