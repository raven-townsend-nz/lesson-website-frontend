const USER_UPDATED = "userUpdated";
const CLOSE_PROFILE_DIALOG = "closeProfileDialog";
const OPEN_PROFILE_DIALOG = "openProfileDialog";
const PROFILE_UPDATED = "profileUpdated";
const PASSWORD_UPDATED = "passwordUpdated";
const USER_NOT_DELETED = "UserNotDeleted";
const SWITCH_TO_PROFILE = "switchToProfile";
const SWITCH_TO_PASSWORD = "switchToPassword";
const ALLOCATION_NOT_DELETED = "AllocationNotDeleted";
const LESSON_NOT_DELETED = "LessonNotDeleted";
const SLACK_MSG_FAILED = "slackMessageFailed";

export default {
    USER_UPDATED, // current user details have been updated (e.g. used to update name in navbar if user edits profile)
    OPEN_PROFILE_DIALOG, // pen edit profile dialog
    CLOSE_PROFILE_DIALOG, // close edit profile dialog
    PROFILE_UPDATED, // displays snackbar message "profile udpated"
    PASSWORD_UPDATED, // displays snackbar message "password updated"
    USER_NOT_DELETED, // displays snackbar message "failed to delete user"
    SWITCH_TO_PROFILE, // switches edit profile dialog to edit profile view
    SWITCH_TO_PASSWORD, // switches edit profile dialog to edit password view,
    ALLOCATION_NOT_DELETED, // displays snackbar message "failed to delete allocation"
    LESSON_NOT_DELETED, // displays snackbar message "failed to delete lesson",
    SLACK_MSG_FAILED, // displays snackbar message that slack messag failed
};