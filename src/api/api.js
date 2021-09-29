import loginRegister from "@/api/users/loginRegister";
import crudUsers from "@/api/users/crudUsers";
import crudAdmins from "@/api/users/crudAdmins";
import slackApi from "@/api/slack/slackApi";
import crudLessons from "@/api/lessons/crudLessons";
import lessonHelpers from "@/api/lessons/lessonHelpers";
import storageApi from "@/api/storage/storageApi";
import crudAllocations from "@/api/allocations/crudAllocations";
import resetPassword from "@/api/resetPassword/resetPassword";
import allocationHelpers from "@/api/allocations/allocationHelpers";
import crudResources from "@/api/resources/crudResources";

export default {
    slackApi: slackApi,
    loginRegister: loginRegister,
    crudUsers: crudUsers,
    crudAdmins: crudAdmins,
    crudLessons: crudLessons,
    lessonHelpers: lessonHelpers,
    storageApi: storageApi,
    crudAllocations: crudAllocations,
    allocationHelpers: allocationHelpers,
    resetPassword: resetPassword,
    crudResources: crudResources
}
