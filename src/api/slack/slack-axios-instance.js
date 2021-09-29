import axios from "axios";

// Axios instance for slack
const slackAxiosInstance = axios.create({
    baseURL: `https://slack.com/api`,
    timeout: 5000
});

const token = process.env.VUE_APP_SLACK_TOKEN;

slackAxiosInstance.interceptors.request.use(
    config => {
        config.transformRequest = [(data) => {
            data = `token=${token}&${data}`;
            return data
        }];

        return config;
    },
    error => Promise.reject(error)
);

export default slackAxiosInstance;
