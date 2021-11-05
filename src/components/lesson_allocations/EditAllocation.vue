<template>
  <div class="dialog-wrapper">
    <v-overlay :opacity="0.8" v-model="dialog">
      <v-dialog v-model="dialog"
              @close="close"
              scrollable
              :max-width="dialogWidth"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
            color="primary"
            dark
            src="../../assets/login-background.png"
          >
            <v-toolbar-title class="view-create-allocation-title">View Lesson Allocation</v-toolbar-title>
            <v-btn class="modal-close-button" icon v-on:click="dialog.value = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-toolbar>

          <v-card-text>

            <div class="view-lesson-modal-h1">{{ fullTitle }}</div>
            <v-divider></v-divider>

            <v-form
              ref="form"
              lazy-validation
            >
              <div class="full-width-select">
                <p class="filter-titles">Instructor(s)</p>
                <v-autocomplete
                  auto-select-first
                  v-model="selectedUsers"
                  :items="users"
                  :search-input.sync="userInput"
                  chips
                  deletable-chips
                  label="Select the instructor(s)"
                  multiple
                  :rules="rules.instructorRules"
                  placeholder="Select the instructor(s)"
                  solo
                  style="width: available; height: 7vh"
                  @change="clickUserHandler"
                >
                </v-autocomplete>
              </div>

              <br>

              <v-card>
                <v-simple-table class="details-table">
                  <thead class="view-lesson-card-title">
                  <tr>
                    <td>Lesson Plan Due</td>
                    <td>Lesson Date</td>
                    <td>Year Level</td>
                    <td>Period</td>
                    <td>Time</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{{ dueDate }}</td>
                    <td @click="changeDate" class="pointer-cursor" id="lessonDateCell">
                      <v-text-field
                        style="width: 100px"
                        class="pointer-cursor no-padding no-margin"
                        v-model="formattedDateString"
                        :rules="rules.dateRules"
                        readonly
                        hide-details
                        rounded
                      >
                        <v-icon
                          class="pointer-cursor"
                          slot="append"
                          style="margin-left: 5px">
                          mdi-pencil
                        </v-icon>
                      </v-text-field>
                      <v-menu
                        min-width="auto"
                        :max-width=datePickerWidth
                        offset-y
                        transition="scale-transition"
                        absolute
                        :position-x="datePickerX"
                        :position-y="datePickerY"
                        v-model="editingDate">
                        <v-date-picker
                          v-model="date"
                          :min="dateModule.currentIsoDate()"
                          no-title
                          show-adjacent-months
                          @input="datepickerHandler()"
                        />
                      </v-menu>
                    </td>
                    <td id="yearGroupCell">
                      <v-combobox
                        class="no-margin no-padding"
                        ref="yearGroupCombo"
                        rounded
                        v-model="selectedYearGroups"
                        :items="yearOptions"
                        :search-input.sync="yearGroupInput"
                        style="width: 200px"
                        :rules="rules.yearGroupRules"
                        hide-details="auto"
                        :menu-props="{ top: true, offsetY: true }"
                        multiple
                        @change="clickYearGroupHandler()">
                      </v-combobox>
                    </td>
                    <td id="periodCell">
                      <v-combobox
                        class="no-margin no-padding"
                        rounded
                        style="width: 80px;"
                        width="50"
                        v-model="period"
                        :rules="rules.periodRules"
                        hide-details="auto"
                        :menu-props="{ maxWidth: '150' }"
                        :items="periodOptions">
                      </v-combobox>
                    </td>
                    <td>{{ time || "N/A" }}</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-card>

            </v-form>

            <div v-if="changesMade" class="save-changes-wrapper">
              <br>
              <v-btn
                class="mr-4 dialog-button"
                @click="cancelChanges"
              >
                Cancel
              </v-btn>
              <v-btn
                :loading="saveButtonLoading"
                class="mr-4 dialog-button"
                style="background: #1f4685; color: white"
                @click="saveChanges(false)"
              >
                Save
              </v-btn>
            </div>

            <br>
            <v-divider></v-divider>
            <div class="view-lesson-modal-h2">
              LESSON SUBMISSION
              <v-chip
                :color="getColor(state)"
                dark
              >
                {{ state }}
              </v-chip>
            </div>
            <v-treeview
              :items="allocationFiles"
              activatable
              item-key="id"
              open-on-click
              :open="openFolders"
              transition
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.type" style="padding-inline: 0.3vw">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else style="padding-inline: 0.3vw">
                  {{ fileIcons[item.type] }}
                </v-icon>
              </template>
              <template v-slot:label="{ item }">
                <div v-if="item.type" class="edit-lesson-file">
                  <a
                    href="#"
                    v-text="item.name"
                    v-on:click.stop="downloadFile(item)"
                  ></a>
                  <v-btn icon @click="deleteAllocationFile(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
                <div v-else class="edit-lesson-folder">
                  <p class="folder-name"> {{ item.name }} {{ (item.children.length === 0) ? '(empty)' : '' }}</p>
                  <v-btn icon @click.stop="openAddFileDialog()"><v-icon>mdi-plus</v-icon></v-btn>
                </div>

              </template>
            </v-treeview>

            <div v-if="state === 'Rejected'">
              <br>
              <p style="margin-bottom: 5px">Feedback</p>
              <v-textarea
                style="position: relative"
                color="#1f4685"
                v-model="feedback"
                :rules="rules.feedbackRules"
                solo
                placeholder="Why was the lesson rejected?"
                auto-grow
                rows="3"
                class="font-paragraph"
                @keyup.enter="feedbackEnterHandler"
              >
                <template v-slot:append>
                  <v-btn
                    class="mx-2 save-feedback-button"
                    fab
                    dark
                    small
                    color="#1f4685"
                    :disabled="feedbackDisabled"
                    @click="saveFeedback">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>

                </template>
              </v-textarea>

            </div>

            <div class="save-changes-wrapper">
              <v-btn
                style="background: #A60000; color: white"
                :disabled="state === 'Not Submitted' || state === 'Rejected'"
                class="mr-4 dialog-button"
                @click="changeState('Rejected')"
              >
                Reject
              </v-btn>
              <v-btn
                class="mr-4 dialog-button"
                :disabled="state === 'Not Submitted' || state === 'Pending Approval'"
                style="background: #D38800; color: white"
                @click="changeState('Pending Approval')"
              >
                Pending
              </v-btn>
              <v-btn
                class="mr-4 dialog-button"
                :disabled="state === 'Not Submitted' || state === 'Approved'"
                style="background: #3C882F; color: white"
                @click="changeState('Approved')"
              >
                Approve
              </v-btn>
              <v-btn
                :disabled="state !== 'Approved'"
                class="mr-4 dialog-button"
                style="background: #3C882F; color: white"
                @click="archiveFiles()"
                v-if="!filesArchived"
              >
                Archive
              </v-btn>
              <v-btn
                  :disabled="(state !== 'Approved') && (allocationFiles[0].children.length < 1)"
                  class="mr-4 dialog-button"
                  style="background: #A60000; color: white"
                  @click="unarchiveFiles()"
                  v-else
              >
                Un-archive
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        <NewFile ref="newFileDialog" @getFiles="getFileNames(true)"/>
      </template>
    </v-dialog>
    </v-overlay>

    <ConfirmDialog ref="confirmDialog" @saveChanges="saveChanges(true)"/>
  </div>
</template>

<script>
import api from "@/api/api";
import validation from "@/common/validation";
import NewFile from "@/components/all_lessons/edit_lesson/NewFileDialog";
import ConfirmDialog from "@/components/all_lessons/edit_lesson/ConfirmDialog";
import date from "@/common/date";


export default {
  name: "EditAllocation.vue",
  components: {NewFile, ConfirmDialog},

  data() {
    return {
      dialogWidth: '60vw',
      dialog: false,

      saveButtonLoading: false,

      allocationId: null,
      lessonId: null,
      period: '',
      fullTitle: '',
      dueDate: '',
      formattedDateString: '',
      date: '',
      time: '',
      lessonPlanRequired: '',
      yearGroup: '',
      state: '',
      feedback: '',
      initialFeedback: '',

      initiallySelectedUsers: [],
      initialLessonDate: null,
      initialYearGroups: null,
      initialPeriod: null,

      dateModule: date,
      datePickerWidth: 290,
      datePickerX: 0, // x position date picker will appear at
      datePickerY: 0, // y position date picker will appear at

      users: [],
      selectedUsers: [],
      userInput: '',

      editingDate: false,

      yearGroupInput: '',
      yearOptions: ['Basic 1', 'Basic 2', 'Proficiency', 'Advanced', 'All'],
      selectedYearGroups: [],

      periodOptions: ['1', '2', 'Both'],

      rules: validation.allocationRules,

      fileIcons: {
        pdf: 'mdi-file-pdf',
        doc: 'mdi-file-word',
        docx: 'mdi-file-word',
        ppt: 'mdi-file-powerpoint',
        pptx: 'mdi-file-powerpoint',
      },
      allocationFiles: [],
      openFolders: [],
      filesArchived: false,
    }
  },

  watch: {
    allocationFiles: async function () {
      await this.checkFilesArchived();
    }
  },

  computed: {

    changesMade() {
      if (this.initialLessonDate !== this.formattedDateString) {
        return true;
      }
      if (this.initialPeriod !== this.period) {
        return true;
      }
      if (this.initialYearGroups.length !== this.selectedYearGroups.length) {
        return true;
      }
      if (this.initiallySelectedUsers.length !== this.selectedUsers.length) {
        return true;
      }
      for (let year of this.selectedYearGroups) {
        if (!this.initialYearGroups.includes(year)) {
          return true;
        }
      }
      for (let selectedUser of this.selectedUsers) {
        let found = false;
        if (selectedUser.value) { // sometimes selected user has text & value, sometimes it is just the value \_ಠ_ಠ_/
          selectedUser = selectedUser.value;
        }
        for (let initialUser of this.initiallySelectedUsers) {
          if (initialUser.value) { // sometimes initial user has text & value, sometimes it is just the value \_ಠ_ಠ_/
            initialUser = initialUser.value;
          }
          if (initialUser.id === selectedUser.id) {
            found = true;
          }
        }
        if (!found) {
          return true;
        }
      }
      return false;
    },

    feedbackDisabled() {
      return this.feedback === this.initialFeedback;
    }
  },

  methods: {

    async open(allocationId) {
      await this.getUsers();
      await this.getAllocationData(allocationId);
      await this.checkFilesArchived();
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    getUsers: async function () {
      this.users = [];
      this.selectedUsers = [];
      const response = await api.crudUsers.getAllUsers();
      for (let user of response.data) {
        let fullName = `${user.lastName}, ${user.firstName}`;
        let userObj = {
          text: fullName,
          value: user
        };
        this.users.push(userObj);
      }
    },

    getAllocationData: async function (allocationId) {
      try {
        this.allocationId = allocationId;

        let res = await api.crudAllocations.getOneAllocation(allocationId);        
        this.setAllocationVariables(res.data);
        await this.getFileNames();
        this.formatDates(res.data.date);
        this.setSelectedUsers(res.data);
        this.setInitialValues();
      } catch (err) {
        console.error(err);
      }
    },

    setAllocationVariables(data) {
      this.lessonId = data.lessonId;
      this.period = data.period;
      this.dueDate = data.dueDate;
      this.time = data.time;
      this.lessonPlanRequired = data.lessonPlanRequired;
      this.yearGroup = data.yearGroup;
      this.state = data.state;
      this.feedback = data.feedback;
      this.fullTitle = `${data.code} ${data.yearLevel}.${data.lessonNumber} ${data.title}`;
      this.selectedYearGroups = this.getYearsAsList(this.yearGroup);
      this.date = this.getDatepickerModel(data.date);
      this.formatDates(this.date);
    },

    setInitialValues() {
      // to detect if changes have been made
      this.initiallySelectedUsers = this.selectedUsers.slice();
      this.initialLessonDate = this.formattedDateString;
      this.initialYearGroups = this.selectedYearGroups;
      this.initialPeriod = this.period;
      this.initialFeedback = this.feedback;
    },
    
    setSelectedUsers(data) {
      let selectedUsers = [];
      for (let instructor of data.instructors) {
        let fullName = `${instructor.lastName}, ${instructor.firstName}`;
        let [userListObj] = this.users.filter(user => user.value.id === instructor.id);
        let userObj = {
          text: fullName,
          value: userListObj.value
        };
        selectedUsers.push(userObj);
      }
      this.selectedUsers = selectedUsers;
    },

    formatDates(date) {
      let lessonDate = new Date(date);
      let year = lessonDate.getFullYear().toString().substring(2);
      this.formattedDateString = `${lessonDate.getDate()}/${lessonDate.getMonth() + 1}/${year}`;

      let dueDate;
      if (this.lessonPlanRequired) {
        dueDate = new Date(this.date);
        dueDate.setDate(dueDate.getDate() - process.env.VUE_APP_LESSON_PLAN_DUE);
        year = dueDate.getFullYear().toString().substring(2);
        this.dueDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${year}`;
      } else {
        this.dueDate = "Not Required";
      }
    },

    getYearsAsList(yearGroupString) {
      if (yearGroupString === 'All') {
        return this.yearOptions;
      }
      let years = yearGroupString.split(', ');
      for (let year of years) {
        if (!this.yearOptions.includes(year)) {
          this.yearOptions.push(year);
        }
      }
      return years;
    },

    getDatepickerModel(date) {
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      return date.toISOString().substring(0, 10);
    },

    async getFileNames(calledAfterFileUpload) {
      try {
        const notSubmittedOrRejected = this.state === 'Rejected' || this.state === "Not Submitted";
        let res = await api.allocationHelpers.getAllocationFiles(this.allocationId)
        this.allocationFiles = res.data;
        for (let i = 0; i < this.allocationFiles.length; i++) {
          this.allocationFiles[i].index = i;
          this.openFolders.push(this.allocationFiles[i].name);
        }
        if (calledAfterFileUpload && notSubmittedOrRejected && this.allocationFiles[0].children.length > 0) {
          this.$emit("updateAllocation", this.allocationId);
          this.state = "Pending Approval"
        }
      } catch(err) {
        console.error(err);
      }
    },

    downloadFile({id}) {
      api.lessonHelpers.getFile(id)
        .then(res => {
          window.open(res.data.url);
        })
    },

    openAddFileDialog() {
      this.$refs.newFileDialog.openNewAllocationFile(this.allocationId);
    },

    deleteAllocationFile(fileId) {
      api.storageApi.deleteFileOfAllocation(this.allocationId, fileId)
        .then(() => {
          this.allocationFiles[0].children = this.allocationFiles[0].children.filter(x => x.id !== fileId);
          if (this.allocationFiles[0].children.length === 0) {
            this.$emit("updateAllocation", this.allocationId);
            this.state = "Not Submitted";
          }
        })
        .catch(err => {
          console.error(err);
        })
    },

    async archiveFiles() {
      for (let file of this.allocationFiles[0].children) {
        await api.storageApi.archive(file.id)
        .catch(err => {
          console.error(err);
        })
      }
      await this.checkFilesArchived();
    },

    async unarchiveFiles() {
      for (let file of this.allocationFiles[0].children) {
        await api.storageApi.deleteFile(file.id)
            .catch(err => {
              console.error(err);
            })
      }
      await this.checkFilesArchived();
    },

    async checkFilesArchived() {
      if (this.allocationFiles[0].children.length > 0) {
        let check = false;
        for (let file of this.allocationFiles[0].children) {
          await api.storageApi.checkFileArchived(file.id)
            .then(res => {
              check = res.data.isArchived === true;
            })
            .catch(err => {
              console.error(err);
            });
        }
        this.filesArchived = check;
      }
    },
    /**
     * If the window is small, set the dialog width to 90%, otherwise set it to 60%.
     * Also repositions the datepicker, year selector and period selector.
     */
    onResize() {
      this.positionDatePicker();

      if (window.innerWidth > 960) {
        this.dialogWidth = '60vw'
      } else {
        this.dialogWidth = '90vw'
      }
    },

    clickUserHandler() {
      this.userInput = '';
    },

    async feedbackEnterHandler(event) {
      if (event.ctrlKey) {
        await this.saveFeedback();
      }
    },

    async saveFeedback() {
      await api.crudAllocations.updateFeedback(this.allocationId, this.feedback);
      this.initialFeedback = this.feedback;
    },

    cancelChanges() {
      this.selectedUsers = this.initiallySelectedUsers.slice();
      this.formattedDateString = this.initialLessonDate;
      this.selectedYearGroups = this.initialYearGroups;
      this.period = this.initialPeriod;
    },

    getOtherInstructorNames(instructorId) {
      if (this.selectedUsers.length === 1) {
        return null;
      } else {
        let selectedUsersCopy = this.selectedUsers.slice();
        for (let user of selectedUsersCopy) {
          if (user.value) {
            user = user.value;
          }
        }
        selectedUsersCopy = selectedUsersCopy.filter(x => x.id !== instructorId);
        const lastUser = selectedUsersCopy.pop();
        let names = selectedUsersCopy.map(user => user.firstName + " " + user.lastName);
        let namesString = names.join(", ");
        if (names.length > 0) {
          namesString += ", and ";
        }
        namesString += `${lastUser.firstName + " " + lastUser.lastName}`;
        return namesString;
      }

    },

    async addedNotification(addedIds) {
      for (let i = 0; i < this.selectedUsers.length; i++) {
        if (this.selectedUsers[i].value !== undefined) {
          this.selectedUsers[i] = this.selectedUsers[i].value;
        }
      }

      for (let instructorId of addedIds) {
        let instructor = this.selectedUsers.find(x => x.id === instructorId);
        let instructorSlack = instructor.slackId;
        let fullName = instructor.firstName + " " + instructor.lastName;
        let otherInstructorNames = this.getOtherInstructorNames(instructorId);
        let message = "*Lesson Notification*\nYou have been added to the following lesson: \n\n";
        message += `*${this.fullTitle}* on *${this.formattedDateString}*\n`;
        if (otherInstructorNames !== null) {
          message += `You are teaching this with ${otherInstructorNames} \n`;
        }
        message += `\nPlease login to the <https://lessons.17squadronatc.com/|lesson website> for more details`;

        try{
          await api.slackApi.sendMessageTo(message, instructorSlack, fullName);
        } catch (err) {
          let message = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          console.log(message);
        }
      }
    },

    async removedNotification(removedIds) {
      for (let i = 0; i < this.initiallySelectedUsers.length; i++) {
        if (this.initiallySelectedUsers[i].value !== undefined) {
          this.initiallySelectedUsers[i] = this.initiallySelectedUsers[i].value;
        }
      }
      for (let instructorId of removedIds) {
        let instructor = this.initiallySelectedUsers.find(x => x.id === instructorId);
        let instructorSlack = instructor.slackId;
        let fullName = instructor.firstName + " " + instructor.lastName;
        let message = "*Lesson Notification*\nYou are no longer teaching the following lesson: \n";
        message += `*${this.fullTitle}* on *${this.formattedDateString}*\n`;
        try {
          await api.slackApi.sendMessageTo(message, instructorSlack, fullName);
        } catch (err) {
          let message = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          console.log(message);
        }
      }
    },

    async changedNotification(remainingIds) {
      for (let i = 0; i < this.selectedUsers.length; i++) {
        if (this.selectedUsers[i].value !== undefined) {
          this.selectedUsers[i] = this.selectedUsers[i].value;
        }
      }
      for (let instructorId of remainingIds) {
        let instructor = this.selectedUsers.find(x => x.id === instructorId);
        let instructorSlack = instructor.slackId;
        let fullName = instructor.firstName + " " + instructor.lastName;
        let message = `*Lesson Notification*\nSome of the details have been updated for your lesson *${this.fullTitle}* `
        + `on *${this.formattedDateString}*\n`;
        message += `Please login to the <https://lessons.17squadronatc.com/|lesson website> for more details`;

        try {
          await api.slackApi.sendMessageTo(message, instructorSlack, fullName);
        } catch (err) {
          let message = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          console.error(message);
        }
      }
    },

    async sendNotifications(){
      let initialIds = [];
      let newIds = [];
      for (let user of this.selectedUsers) {
        if (user.value) {
          newIds.push(user.value.id);
        } else {
          newIds.push(user.id);
        }
      }
      for (let user of this.initiallySelectedUsers) {
        if (user.value) {
          initialIds.push(user.value.id);
        } else {
          initialIds.push(user.id);
        }
      }
      let addedIds = newIds.filter(x => !initialIds.includes(x));
      let removedIds = initialIds.filter(x => !newIds.includes(x));
      let remainingIds = newIds.filter(x => initialIds.includes(x)); //intersection
      await this.addedNotification(addedIds);
      await this.removedNotification(removedIds);
      await this.changedNotification(remainingIds);
    },

    async saveChanges(confirm) {
      this.saveButtonLoading = true;
      if (!this.$refs.form.validate()) {
        return;
      }

      let userIds = [];
      for (let user of this.selectedUsers) {
        if (user.value) {
          userIds.push(user.value.id);
        } else {
          userIds.push(user.id);
        }
      }
      let payload = {
        userIds: userIds,
        lessonId: this.lessonId,
        yearGroup: this.selectedYearGroups.join(", "),
        period: this.period,
        date: this.date,
        lessonPlanRequired: this.lessonPlanRequired
      }
      try {
        await api.crudAllocations.updateAllocation(this.allocationId, payload, confirm);
        this.$emit('updateAllocation', this.allocationId);
        await this.sendNotifications();
        this.setInitialValues();
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$refs.confirmDialog.open(`Warning: ${err.response.data}`)
        } else {
          console.error(err);
        }
      }
      this.saveButtonLoading = false;
    },

    /**
     * Selects the x and y positions of the datepicker, making sure it doesn't go off the edge of the page
     */
    positionDatePicker() {
      const el = document.getElementById('lessonDateCell');
      if (el) {
        const rect = el.getBoundingClientRect();

        // Get the leftmost position of the lesson date cell
        let x = rect.left;

        // If the date picker is going to go over the edge of the screen, move it the minimum amount left
        if (x + this.datePickerWidth > window.innerWidth) {
          x = window.innerWidth - this.datePickerWidth;
        }
        this.datePickerX = x;
        this.datePickerY = rect.top;
      }
    },

    /**
     * This function opens a datepicker window by setting 'this.editingDate' to true.
     * Before doing this, is sets the position of the datepicker.
     */
    changeDate() {
      this.positionDatePicker();
      this.editingDate = !this.editingDate;
    },

    async sendStateChangeSlackMessage(state) {
      for (let i = 0; i < this.initiallySelectedUsers.length; i++) {
        if (this.initiallySelectedUsers[i].value !== undefined) {
          this.initiallySelectedUsers[i] = this.initiallySelectedUsers[i].value;
        }
      }

      let message = `*Lesson Notification*\nYour submission for *${this.fullTitle}* `;
      if (state === "Rejected") {
        message += `has been rejected. Please login to the <https://lessons.17squadronatc.com/|lesson website> for more details`;
      } else if (state === "Approved") {
        message += "has been approved";
      } else if (state === "Pending Approval") {
        message += "has been reset to 'Pending Approval'";
      }

      for (let instructor of this.initiallySelectedUsers) {
        try {
          await api.slackApi.sendMessageTo(message, instructor.slackId, instructor.firstName + " " + instructor.lastName);
        } catch (err) {
          let errorMessage = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          console.error(errorMessage);
        }
      }
    },

    async changeState(state) {
      try {
        await api.crudAllocations.updateState(this.allocationId, state);
        await this.sendStateChangeSlackMessage(state);
        this.state = state;
        this.$emit('updateAllocation', this.allocationId, this.state);
      } catch (err) {
        console.error(err);
      }
    },


    datepickerHandler() {
      let lessonDate = new Date(this.date);
      this.formatDates(lessonDate);
      this.editingDate = false;
    },

    clickYearGroupHandler() {
      let numOptionsChosen = this.selectedYearGroups.filter(item => this.yearOptions.includes(item)).length;

      // If all options except 'All' are selected, then changed to ONLY 'All' being selected
      if (!this.selectedYearGroups.includes('All') && numOptionsChosen === this.yearOptions.length - 1) {
        this.selectedYearGroups = ['All'];

        // If 'All' was clicked first, and then another option, then remove 'All'
      } else if (this.selectedYearGroups[0] === 'All' && this.selectedYearGroups.length > 1) {
        this.selectedYearGroups = this.selectedYearGroups.filter(item => item !== 'All');

        // If 'All' is the most recently added option, then remove all the other options
      } else if (this.selectedYearGroups[this.selectedYearGroups.length - 1] === 'All') {
        this.selectedYearGroups = ['All'];
      }
      this.yearGroupInput = '';
    },

    getColor(state) {
      switch (state) {
        case 'Not Submitted':
          return '#555';
        case 'Pending Approval':
          return '#d38800';
        case 'Approved':
          return '#3c882f';
        case 'Rejected':
          return '#a60000';
      }
    },

  },

  created() {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style scoped>
@import "../../../public/styles/lesson-allocations.css";
@import "../../../public/styles/view-lesson.css";

</style>