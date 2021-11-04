import slackAxiosInstance from "@/api/slack/slack-axios-instance";
import events from "../../common/events";

/**
 * slackMessages.s
 *
 * API for handling slack messages
 *
 */

// Sends a private message to the slack id user
const sendMessageTo = function (message, slackId, fullName) {
    message = message.split("&").join("%26");
    const appendage = `channel=${slackId}&text=${message}&markdwn=true`;

    // Sends a message to the slack log channel too, so admins can see what has been sent.
    const logMessage = "Sent message to " + fullName + ":\n" + message;
    const logAppendage = `channel=${process.env.VUE_APP_SLACK_LOG_CHANNEL_ID}&text=${logMessage}&markdwn=true`;
    slackAxiosInstance.post(`/chat.postMessage`, logAppendage)
        .then(res => {
            if (!res.data.ok) {
                console.error("Slack request for change in status failed: " + res.data.error);
            }});

    return slackAxiosInstance.post(`/chat.postMessage`, appendage)
        .then(res => {
            if (!res.data.ok) {
                console.error("Slack request for change in status failed: " + res.data.error);
                const event = new Event(events.SLACK_MSG_FAILED);
                window.dispatchEvent(event);
            }
            return res;
        });
};

// Sends the register message to slack id user. Doubles as a validation check for the slackId.
const registerMessage = function (slackId, fullName) {
    const message = "*You have registered on ATC Lesson Website using this slack account.* :smile: \n" +
        "You will receive notifications from this slack bot when you have been allocated lessons to teach.";
    return sendMessageTo(message, slackId, fullName);
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
