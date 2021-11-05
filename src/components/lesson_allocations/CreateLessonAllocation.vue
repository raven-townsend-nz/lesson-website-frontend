<template>
  <div>
    <v-overlay :opacity="0.8" v-model="dialog">
      <v-dialog v-model="dialog"
              :max-width="dialogWidth"
              scrollable
    >
      <template>
        <v-card>
          <v-toolbar
            color="primary"
            dark
            src="../../assets/login-background.png"
          >
            <v-toolbar-title class="view-lesson-title">Allocate Lessons</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-list>
              <v-list-item>
                <div class="full-width-select">
                  <p class="filter-titles">Instructor(s)</p>
                  <v-autocomplete
                    ref="userDropdown"
                    auto-select-first
                    v-model="selectedUsers"
                    :items="users"
                    :search-input.sync="userInput"
                    chips
                    clearable
                    label="Select the instructor(s)"
                    multiple
                    placeholder="Select the instructor(s)"
                    solo
                    style="width: available; height: 7vh"
                    @change="clickUserHandler"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip close @click:close="selectedUsers.splice(index, 1)">
                        {{ item.text }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </div>
              </v-list-item>

              <v-list-item>
                <v-divider/>
              </v-list-item>

              <v-list-item v-if="this.selectedLessons.length > 0" class="no-vertical-padding">
                <v-list three-line>
                  <v-list-item v-for="(lesson, i) in selectedLessons" :key="i" active class="no-vertical-padding" style="padding: 0">
                    <v-list-item-content class="no-vertical-padding">
                      <v-list-item-subtitle>
                        <v-form
                          ref="form"
                          v-model="valid"
                          lazy-validation
                        >
                          <v-row class="no-vertical-padding">
                          <v-col
                            cols="12"
                            md="3"
                            sm="4">
                            <v-btn
                              large
                              block
                              style="background-color: white; height: 48px"
                              v-on:click="editLesson(lesson.id)"
                            >
                              <span class="overflow-button">{{lesson.name}}</span>
                              <v-icon style="float: right">mdi-pencil</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col
                            class=""
                            cols="12"
                            md="2"
                            sm="4"
                          >
                            <v-menu
                              v-model="lesson.menu"
                              :close-on-content-click="false"
                              min-width="auto"
                              offset-y
                              transition="scale-transition"
                            >
                              <template v-slot:activator="slot">
                                <v-text-field
                                  v-model="lesson.formattedDate"
                                  v-bind="slot.attrs"
                                  v-on="slot.on"
                                  clearable
                                  :rules="rules.dateRules"
                                  label="Date"
                                  readonly
                                  solo
                                >
                                  <v-icon
                                    slot="prepend-inner"
                                    style="margin-right: 5px">
                                    mdi-calendar
                                  </v-icon>
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="lesson.date"
                                :min="dateModule.currentIsoDate()"
                                no-title
                                show-adjacent-months
                                @input="datepickerHandler(lesson)"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            cols="12"
                            md="2"
                            sm="4"
                          >
                            <v-combobox
                              v-model="lesson.period"
                              :rules="rules.periodRules"
                              :items="periodOptions"
                              clearable
                              label="Period"
                              solo>
                            </v-combobox>
                          </v-col>
                          <v-col
                            cols="12"
                            md="3"
                            sm="4"
                          >
                            <v-tooltip
                              bottom
                              open-delay="500">
                              <template v-slot:activator="slot">
                                <v-combobox
                                  :ref="'yearGroupCombo-' + i"
                                  v-bind="slot.attrs"
                                  v-on="slot.on"
                                  v-model="lesson.years"
                                  :items="yearOptions"
                                  :rules="rules.yearGroupRules"
                                  :search-input.sync="lesson.yearGroupInput"
                                  clearable
                                  label="Year group(s)"
                                  multiple
                                  solo
                                  @change="clickYearGroupHandler(lesson, i)">
                                  <template v-slot:selection="{ item, index }">
                                    <div v-if="index === 0 && lesson.years.length === 1">
                                      <span>{{ item }}</span>
                                    </div>
                                    <div v-if="index === 0 && lesson.years.length > 1">
                                      <span>Multiple</span>
                                    </div>
                                  </template>
                                </v-combobox>
                              </template>
                              <span>To add a year group not in the list, type the name and press enter</span>
                            </v-tooltip>
                          </v-col>

                          <v-col
                            class="no-margin"
                            cols="12"
                            md="1"
                            sm="4"
                          >
                            <v-tooltip
                              bottom
                              open-delay="500">
                              <template v-slot:activator="slot">
                                <span
                                  v-bind="slot.attrs"
                                  v-on="slot.on">
                                  <v-checkbox
                                    ripple
                                    color="#1f4685"
                                    v-model="lesson.lessonPlanRequired"
                                  ></v-checkbox>
                                </span>
                              </template>
                              <span>Lesson plan required</span>
                            </v-tooltip>

                          </v-col>
                          <v-col
                            cols="12"
                            md="1"
                            sm="4"
                            class="no-margin no-left-padding"
                          >
                            <v-tooltip
                              bottom
                              open-delay="500">
                              <template v-slot:activator="slot">
                                <v-btn
                                  class="low-margin-button"
                                  v-bind="slot.attrs"
                                  v-on="slot.on"
                                  @click="removeAllocation(lesson)"
                                  icon>
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </template>
                              <span>Remove lesson</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        </v-form>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-list-item>

              <v-list-item>
                <div class="full-width-select">
                  <v-autocomplete
                    v-model="selectedLesson"
                    auto-select-first
                    :items="lessons"
                    hide-details
                    item-value="lesson"
                    label="Add lesson"
                    placeholder="Add lesson"
                    solo
                    style="width: available"
                    @change="clickLessonHandler"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip close @click:close="selectedLessons.splice(index, 1)">
                        {{ item.lesson.name }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </div>
              </v-list-item>
              <v-list-item>
                <v-slide-x-transition>
                  <v-alert type="error" v-if="error" id="error-box">
                    {{ errorMessage }}
                  </v-alert>
                </v-slide-x-transition>
              </v-list-item>

            </v-list>

            <div class="save-changes-wrapper">
              <v-btn
                class="mr-4 dialog-button"
                @click="closeDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                class="mr-4 dialog-button"
                style="background: #1f4685; color: white"
                :disabled="!this.selectedLessons.length || !this.selectedUsers.length"
                @click="saveAllocations(false)"
              >
                Save
              </v-btn>
            </div>

          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
    </v-overlay>
    <LessonModal ref="editLessonModal" @updateLesson="updateLesson"/>
    <ConfirmDialog ref="confirmDialog" @saveChanges="saveAllocations(true)" @cancelChanges="notifyInstructors"/>
  </div>
</template>

<script>
import api from "@/api/api";
import date from "@/common/date";
import validation from "@/common/validation";
import LessonModal from "@/components/all_lessons/LessonModal";
import ConfirmDialog from "@/components/all_lessons/edit_lesson/ConfirmDialog";


export default {
  name: "CreateLessonAllocation",

  components: {LessonModal, ConfirmDialog},

  data() {
    return {
      dialog: false,
      dialogWidth: '75vw',
      valid: true,
      dateModule: date,

      users: [],
      lessons: [],
      periodOptions: ['1', '2', 'Both'],
      yearOptions: ['Basic 1', 'Basic 2', 'Proficiency', 'Advanced', 'All'],

      userInput: '',
      yearGroupInput: '',

      selectedUsers: [],
      selectedLesson: null,
      selectedLessons: [],
      allocationsForSlack: [], // list of lessons that need to be sent on slack

      rules: validation.allocationRules,
      error: false,
      errorMessage: "Unable to send lesson allocations"
    }
  },

  mounted() {
    this.getLessons();
    this.getUsers();
  },

  watch: {
    selectedUsers() {
      setTimeout(() => {
        this.$refs.userDropdown.isMenuActive  = false;
      }, 50);
    }
  },

  methods: {
    getLessons: async function () {
      const response = await api.crudLessons.getAllLessonsWithTaughtCount();
      for (let lesson of response.data) {
        let lessonObj = {};
        let fullTitle = `${lesson.code} ${lesson.yearLevel}.${lesson.lessonNumber} ${lesson.title}`;
        let value = {
          id: lesson.id,
          name: fullTitle,
          years: [],
          date: null,
          period: null,
          code: lesson.code,
          yearLevel: lesson.yearLevel,
          lessonNumber: lesson.lessonNumber,
          title: lesson.title,
          menu: false,
          lessonPlanRequired: lesson.lessonPlanRequired,
          yearGroupInput: '',
        };
        lessonObj.text = `${fullTitle} (${lesson.taughtCount})`;
        lessonObj.lesson = value;
        this.lessons.push(lessonObj);
      }
    },

    getUsers: async function () {
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

    open() {
      this.dialog = true;
    },

    clickUserHandler() {
      this.userInput = '';
    },

    clickLessonHandler() {
      let lessonCopy = {};
      Object.assign(lessonCopy, this.selectedLesson)
      this.selectedLessons.push(lessonCopy);
      this.$nextTick(() => {
        this.selectedLesson = '';
      });
    },

    clickYearGroupHandler(lesson, index) {
            let numOptionsChosen = lesson.years.filter(item => this.yearOptions.includes(item)).length;

      // If all options except 'All' are selected, then changed to ONLY 'All' being selected
      if (!lesson.years.includes('All') && numOptionsChosen === this.yearOptions.length - 1) {
        lesson.years = ['All'];

      // If 'All' was clicked first, and then another option, then remove 'All'
      } else if (lesson.years[0] === 'All' && lesson.years.length > 1) {
        lesson.years = lesson.years.filter(item => item !== 'All');

      // If 'All' is the most recently added option, then remove all the other options
      } else if (lesson.years[lesson.years.length - 1] === 'All') {
        lesson.years = ['All'];
      }
      this.yearGroupInput = '';
      setTimeout(() => {
        this.$refs['yearGroupCombo-' + index][0].isMenuActive = false;
      }, 50)
    },

    datepickerHandler(lesson) {
      let dateList = lesson.date.split('-');
      let year = dateList[0];
      let month = dateList[1];
      let day = dateList[2];
      year = year[2] + year [3];
      lesson.formattedDate = day + '/' + month + '/' + year;
      lesson.menu = false;
    },

    removeAllocation(lesson) {
      let i = 0;
      let found = false;
      while (i < this.selectedLessons.length && !found) {
        if (this.selectedLessons[i].id === lesson.id) {
          found = true;
        }
        i++;
      }
      this.selectedLessons.splice(i - 1, 1);
    },

    updateLesson(payload) {
      for (let i = 0; i < this.lessons.length; i++) {
        if (this.lessons[i].id === payload.lessonId) {
          this.lessons[i].text = payload.title;
          this.lessons[i].lesson.name = payload.title;
        }
      }
      for (let i = 0; i < this.selectedLessons.length; i++) {
        if (this.selectedLessons[i].id === payload.lessonId) {
          this.selectedLessons[i].name = payload.title;
        }
      }
    },

    editLesson(lessonId) {
      api.crudLessons.getOneLesson(lessonId)
        .then(res => {
          this.$refs.editLessonModal.openEdit(res.data, lessonId);
        }).catch(err => {
        console.error(err);
      });

    },


    /**
     * Returns a nicely formatted string of all the selected users except for the user with ID 'instructorId'
     * @param instructorId will return a list of all users except this one
     * @returns {string} of the from "Smith J, Johnson A, Chen W"
     */
    getNameString(instructorId) {
      if (this.selectedUsers.length === 1) {
        return '';
      }
      let namesString = ' along with ';
      const users = this.selectedUsers.filter(user => user.id !== instructorId);

      if (users.length > 1) {
        for (let user of users.slice(0, users.length - 1)) {
          namesString += user.firstName + " " + user.lastName + ", ";
        }
        namesString += "and " + users[users.length - 1].firstName + " "  + users[users.length - 1].lastName;
      } else {
        namesString += users[0].firstName + " " + users[0].lastName;
      }
      return namesString;
    },

    async notifyInstructors() {
      let message = "*Lesson Notification*\nYou have been assigned the following lessons: \n\n";
      let insertPosition = message.length - 4; // if there are additional instructors we will insert their names here

      this.allocationsForSlack.sort(function(a,b){return new Date(a.date) - new Date(b.date)});

      for (let lesson of this.allocationsForSlack){
        let lessonLine = `- ${lesson.code} ${lesson.yearLevel}.${lesson.lessonNumber} ${lesson.title} on ${lesson.formattedDate}\n`;
        message += lessonLine;
      }

      message += `\nPlease login to the <https://lessons.17squadronatc.com/|lesson website> for more details`;

      for (let user of this.selectedUsers) {
        try {
          let personalisedMessage = message.slice(0, insertPosition) + this.getNameString(user.id) + message.slice(insertPosition);
          await api.slackApi.sendMessageTo(personalisedMessage, user.slackId, user.firstName + " " + user.lastName);
        } catch (err) {
          let message = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          this.showError(message);
        }
      }
    },

    async saveAllocations(confirm) {
      for (let i = 0; i < this.$refs.form.length; i++) {
        if (!this.$refs.form[i].validate()) {
          this.valid = false
        }
      }

      let lessonsCopy = this.selectedLessons.slice(); // list of lessons to send slack notifications for
      if (this.valid) {
        let sendSlack = true;
        for (let lesson of lessonsCopy) {
          let userIds = [];
          for (let user of this.selectedUsers) {
            userIds.push(user.id);
          }
          const payload = {
            userIds: userIds,
            lessonId: lesson.id,
            yearGroup: lesson.years.join(', '),
            period: lesson.period,
            date: lesson.date,
            lessonPlanRequired: lesson.lessonPlanRequired
          }
          try {
            let response = await api.crudAllocations.postAllocation(payload, confirm);
            if (response.status === 200) {
              this.allocationsForSlack.push(lesson);
            }
            this.selectedLessons = this.selectedLessons.slice(1);

          } catch (error) {
            if (error.response.status === 409) {
              this.$refs.confirmDialog.open(`Warning: ${error.response.data}`);
              sendSlack = false;
            } else {
              let message = error.response.data.length > 0 ? error.response.data : "Unable to save lesson allocations";
              this.showError(message);
              return;
            }
          }
        }
        if (sendSlack) {
          await this.notifyInstructors();
        }
        this.$emit('created');
        this.dialog = false;
        if (this.selectedLessons.length === 0) {
          this.selectedUsers = [];
          this.allocationsForSlack = [];
        }
      }
    },

    showError(msg) {
      this.errorMessage = msg;
      this.error = true;
      setTimeout( () => {
        this.error = false;
      }, 8000)
    },

    closeDialog() {
      this.dialog = false;
      this.valid = true;
      this.userInput = '';
      this.yearGroupInput = '';
      this.selectedUsers = [];
      this.selectedLesson = null;
      this.selectedLessons = [];
      this.error = false;
      this.errorMessage = "Unable to send lesson allocations";
    }
  }
}
</script>

<style scoped>
@import "../../../public/styles/lesson-allocations.css";
</style>