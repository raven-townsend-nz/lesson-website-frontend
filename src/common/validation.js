import api from "@/api/api";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const slackIdValidation = function (slackId) {
    return api.slackApi.findSlackUser(slackId).then(
        res => res.data.ok);
}

const userRules = {
    firstNameRules: [
        v => !!v || 'First Name is required',
        v => (v && v.length <= 20) || 'First Name must be less than 20 characters',
    ],
    lastNameRules: [
        v => !!v || 'Last Name is required',
        v => (v && v.length <= 20) || 'Last Name must be less than 20 characters',
    ],
    emailRules: [
        v => !!v || 'E-mail is required',
        v => emailRegex.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters',
    ],
};

const lessonRules = {
    codeRules: [
        v => !!v || 'Subject Code is required',
        v => (v && v.length <= 4) || 'Max 4 characters',
    ],
    yearLevelRules: [
        v => !!v || 'Year level is required',
        v => (v && parseInt(v) && v <= 5 && v >=1 ) || 'Year level must be between 1 and 5',
    ],
    lessonNumberRules: [
        v => !!v || 'Lesson number is required',
        v => (v && v >= 0) || 'Lesson number must be a positive integer or zero',
    ],
    titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length <= 128) || 'Max 128 characters',
    ],
    timeRules: [
        v => (v.length <= 128) || 'Max 128 characters',
    ],
    whenToTeach: [
        v => (v.length <= 1000) || 'Max 1000 characters',
    ],
    scopeRules: [
        v => (v.length <= 1000) || 'Max 1000 characters',
    ],
    trainingNotesRules: [
        v => (v.length <= 1000) || 'Max 1000 characters',
    ],
    instructorNotesRules: [
        v => (v.length <= 1000) || 'Max 1000 characters',
    ],
    referencesRules: [
        v => (v.length <= 1000) || 'Max 1000 characters',
    ]
};


const allocationRules = {
    periodRules: [
        v => !!v || 'Period is required',
        v => (v && v.length <= 100) || 'Max 100 characters',
    ],
    dateRules: [
        v => !!v || 'Date is required',
    ],
    yearGroupRules: [
        v => v.length > 0 || 'Year group is required',
    ],
    instructorRules: [
        v => v.length > 0 || 'At least one instructor is required',
    ],
    feedbackRules: [
        v => !v || v.length <= 1000 || 'Max 1000 characters',
    ]
}

const trainingProgramRules = {
    linkRules: [
        v => v.startsWith('https://docs.google.com/spreadsheets')
            || 'Must be a google spreadsheet share link',
    ],
    embeddedRules: [
        v => v.startsWith('https://docs.google.com/spreadsheets')
            || 'Must be a google spreadsheet',
        v => v.endsWith('pubhtml')
            || 'Must be an embeddable link (should end with \'pubhtml\')',
    ]
}

export default {
    emailRegex,
    userRules,
    slackIdValidation,
    lessonRules,
    allocationRules,
    trainingProgramRules
}