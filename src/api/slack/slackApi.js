import slackAxiosInstance from "@/api/slack/slack-axios-instance";

/**
 * slackMessages.s
 *
 * API for handling slack messages
 *
 */

// Sends a private message to the slack id user
const sendMessageTo = function (message, slackId) {
    message = message.split("&").join("%26");
    const appendage = `channel=${slackId}&text=${message}&markdwn=true`;

    return slackAxiosInstance.post(`/chat.postMessage`, appendage)
        .then(res => res);
};

// Sends the register message to slack id user. Doubles as a validation check for the slackId.
const registerMessage = function (slackId) {
    const message = "*You have registered on ATC Lesson Website using this slack account.* :smile: \n" +
        "You will receive notifications from this slack bot when you have been allocated lessons to teach.";
    return sendMessageTo(message, slackId);
};


const findSlackUser = function (slackId) {
    const appendage = `user=${slackId}`;

    return slackAxiosInstance.post(`/users.getPresence`, appendage)
        .then(res => res);
}


export default {
    sendMessageTo,
    registerMessage,
    findSlackUser
};
