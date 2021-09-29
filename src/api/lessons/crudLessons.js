/**
 * crudLessons.js
 *
 * API for handling lesson CRUD
 */
import axiosInstance from '../axios-instance'

const getAllLessons = function () {
    return axiosInstance.get('/lessons')
        .then(res => res);
};

const getAllLessonsWithTaughtCount = function () {
    return axiosInstance.get('/lessons?taughtCount=true')
        .then(res => res);
}

const getOneLesson = function (lessonId) {
    return axiosInstance.get(`/lessons/${lessonId}`)
        .then(res => res);
};

const updateLesson = function (lessonId, payload, confirm) {
    return axiosInstance.patch(`/lessons/${lessonId}`, payload, {params: {confirm: confirm}})
        .then(res => res);
};


const updateInstructorNotes = function (lessonId, instructorNotes) {
    return axiosInstance.patch(`/lessons/${lessonId}/instructor-edit`, {"instructorNotes": instructorNotes});
}

const createLesson = function (payload, confirm) {
    return axiosInstance.post(`/lessons`, payload, {params : {confirm: confirm}})
        .then(res => res);
};

const deleteLesson = function (lessonId) {
    return axiosInstance.delete(`/lessons/${lessonId}`, )
        .then(res => res);
};

export default {
    getAllLessons,
    getAllLessonsWithTaughtCount,
    getOneLesson,
    updateLesson,
    createLesson,
    updateInstructorNotes,
    deleteLesson
}