<template>
    <v-card class="all-lessons-table-wrapper"
            id="table-wrapper">
      <v-card-title>
        <strong style="font-size: 3rem">Manage Users</strong>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search names..."
          single-line
          hide-details
          color="#1f4685"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        disable-pagination
        :hide-default-footer = "true"
        fixed-header
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            style="margin-right: 20px;"
            :disabled="!!item.isAdmin && !loggedInAsDgaa"
            @click="editUser(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            :disabled="!!item.isAdmin && !loggedInAsDgaa"
            @click="deleteUser(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <v-alert
        v-if="alert"
        border="bottom"
        color="red"
        dismissible
        elevation="12"
        type="error"
      >{{alertMsg}}</v-alert>

      <v-dialog
        v-model="deleteDialog"
        max-width="380"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{ `Are you sure you want to delete ${this.selectedFirstName} ${this.selectedLastName}?` }}
          </v-card-title>
          <v-card-text>
            All personal data will be removed, but their lesson plans will remain.
          </v-card-text>
          <v-card-actions style="display: flex; flex-direction: row; justify-content: center">
            <v-btn
              class="ma-1"
              style="color: grey"
              plain
              @click="cancelDelete"
            >
              Cancel
            </v-btn>

            <v-btn
              class="ma-1"
              style="color: red"
              plain
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <EditProfileDialog :edit-self="false"
                         :edit-user-id="selectedUserId"
                         @userUpdated="updateEditedUser"
                         ref="editProfile"/>
    </v-card>
</template>

<script>
import storage_util from "@/common/storage_util";
import api from "@/api/api";
import events from "@/common/events";
import EditProfileDialog from "@/components/edit_profile/EditProfileDialog";


export default {
  name: "ManageUsers",
  title: '17 SQN | Manage Users',
  components: {EditProfileDialog},
  data() {
    return {
      loading: true,
      search: '',
      headers: [
        { text: 'Name', value: 'fullName', filterable: true },
        { text: 'Email', value: 'email', filterable: false },
        { text: 'Slack ID', value: 'slackId', filterable: false },
        { text: 'Role', value: 'role', filterable: false },
        { text: 'Actions', value: 'actions', filterable: false, sortable: false },
      ],
      users: [],
      alert: false,
      alertMsg: null,
      deleteDialog: false,
      selectedUserId: 0,
      selectedFirstName: '',
      selectedLastName: '',
      selectedEmail: '',
      selectedSlackId: '',
      loggedInAsDgaa: false,
    }
  },

  mounted() {
    this.loggedInAsDgaa = (storage_util.getUserDetails().email === process.env.VUE_APP_DGAA_EMAIL);
    this.getAllUsers();
  },

  methods: {

    getAllUsers() {
      api.crudUsers.getAllUsers()
        .then(res => {
          let data = res.data;
          for (let i = 0; i < data.length; i ++) {
            const raw = data[i];
            data[i].fullName = `${raw.lastName}, ${raw.firstName}`;
            data[i].role = data[i].isAdmin ? "Training Officer" : "Instructor";
            if (data[i].id !== storage_util.getUserId()) {
              this.users.push(data[i]);
            }
          }
          this.loading = false;
        }).catch(err => {
        console.error(err);
          this.showAlert('Unable to get all users');
      })
    },

    showAlert(msg) {
      this.alertMsg = msg;
      this.alert = true;
    },

    editUser(user) {
      this.$refs.editProfile.open(user);
    },

    updateEditedUser(user) {
      let i = 0;
      let found = false;
      while(i < this.users.length && !found) {
        if (this.users[i].id === user.id) {
          this.users[i].firstName = user.firstName;
          this.users[i].lastName = user.lastName;
          this.users[i].email = user.email;
          this.users[i].slackId = user.slackId;
          this.users[i].fullName = `${user.lastName}, ${user.firstName}`;
          this.users[i].isAdmin = user.isAdmin;
          this.users[i].role = user.isAdmin ? "Training Officer" : "Instructor";
          found = true;
        }
        i++;
      }
    },

    deleteUser(user) {
      this.selectedUserId = user.id;
      this.selectedFirstName = user.firstName;
      this.selectedLastName = user.lastName;
      this.selectedEmail = user.email;
      this.selectedSlackId = user.slackId;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await api.crudUsers.deleteUser(this.selectedUserId);
        this.deleteDialog = false;
        let i = 0;
        let found = false;
        while (i < this.users.length && !found) {
          if (this.users[i].id === this.selectedUserId) {
            found = true;
          }
          i++;
        }
        this.users.splice(i - 1, 1);
      } catch {
        const event = new Event(events.USER_NOT_DELETED);
        window.dispatchEvent(event);
      }
    },

    cancelDelete() {
      this.deleteDialog = false;
    },

  },

}
</script>

<style scoped>
@import "../../../public/styles/all-lessons.css";
</style>