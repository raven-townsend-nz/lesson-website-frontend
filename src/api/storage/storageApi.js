import axiosInstance from "@/api/axios-instance";

/**
 * slackMessages.s
 *
 * API for handling slack messages
 *
 */

const uploadToArchive = function (file, filename, lessonId, group) {

    return axiosInstance.post(`/storage/directArchive`, file,
        {
            params: {filename: filename, lessonId: lessonId, group: group},
            headers: {
                'Content-Type': file.type
            }
        })
        .then(res => res);
};


const deleteFile = function (fileId) {
    return axiosInstance.delete(`/storage/${fileId}`)
      .then(res => res);
};

const archive = function (fileId) {
    return axiosInstance.post(`/storage/${fileId}/archive`)
        .then(res => res);
};

const uploadToAllocation = function (file, filename, allocationId) {
    return axiosInstance.post(`allocations/${allocationId}/files`, file, {
        params: {filename: filename, allocationId: allocationId},
        headers: {
            'Content-Type': file.type
        }
    })
        .then(res => res);
};

const deleteFileOfAllocation = function (allocationId, fileId) {
    return axiosInstance.delete(`/allocations/${allocationId}/files/${fileId}`)
        .then(res => res);
};

const checkFileArchived = function (fileId) {
    return axiosInstance.get(`/storage/${fileId}/isArchived`)
        .then(res => res);
}

export default {
    uploadToArchive,
    deleteFile,
    archive,
    uploadToAllocation,
    deleteFileOfAllocation,
    checkFileArchived,
};
