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
            <div class="view-lesson-modal-h1">{{ lessonData.fullTitle }}</div>
            <v-divider></v-divider>

            <div class="view-lesson-modal-h2">
              YOUR LESSON
              <v-chip
                :color="getColor(lessonData.state)"
                dark>
                {{ lessonData.state }}
              </v-chip>
            </div>

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
                    <td>{{ lessonData.dueDate }}</td>
                    <td>{{ lessonData.lessonDate }}</td>
                    <td>{{ lessonData.yearGroup }}</td>
                    <td>{{ lessonData.period }}</td>
                    <td>{{ lessonData.time || "N/A" }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
            <v-card class="instructor-card" v-if="instructors">
              <v-simple-table class="details-table">
                <tbody class="instructor-table-colors">
                  <tr class="instructor-row">
                    <td class="other-instructor-cell">Additional Instructors:</td>
                    <td>{{ instructors }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>

            <br>

            <div v-if="lessonData.lessonPlanRequired">
            <p style="margin-bottom: 0">Upload your lesson plan, handouts and other resources here:</p>
              <v-treeview
                :items="allocationFiles"
                activatable
                item-key="id"
                :open="openAllocationFiles"
                open-on-click
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
            </div>
            <div v-if="lessonData.state === 'Rejected' || (lessonData.state === 'Pending' && lessonData.feedback)">
              <p style="margin-bottom: 5px">Feedback</p>
              <v-textarea
                style="position: relative"
                color="#1f4685"
                v-model="lessonData.feedback"
                readonly
                solo
                auto-grow
                rows="3"
                class="font-paragraph"
              ></v-textarea>
            </div>
            <div v-else>
              <br>
            </div>
            <v-divider></v-divider>
            <div class="view-lesson-modal-h2">LESSON DETAILS</div>


            <div class="view-lesson-cards-wrapper">
              <v-card class="scope-references-card">
                <v-card-title class="view-lesson-card-title">
                  Scope
                </v-card-title>
                <v-textarea
                    color="#1f4685"
                    v-model="lessonData.scope"
                    rows="6"
                    :readonly="true"
                    hide-details="true"
                    solo
                    flat
                    label=""
                    class="font-paragraph"
                ></v-textarea>
              </v-card>

              <v-card class="scope-references-card">
                <v-card-title class="view-lesson-card-title">
                  References
                </v-card-title>
                <v-textarea
                    color="#1f4685"
                    v-model="lessonData.references"
                    rows="6"
                    :readonly="true"
                    hide-details="true"
                    solo
                    flat
                    label=""
                    class="font-paragraph"
                ></v-textarea>
              </v-card>
            </div>

            <v-expansion-panels accordion multiple>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="expansion-header-reduced-padding"
                  @mouseover="trainingNotesHover = true"
                  @mouseleave="trainingNotesHover = false">
                  <p style="color: #1f4685; text-align: left; max-width: 115px">Training Notes</p>
                  <transition name="fade">
                    <p v-if="trainingNotesHover"> - notes from the training office</p>
                  </transition>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-textarea
                      color="#1f4685"
                      v-model="lessonData.trainingNotes"
                      rows="1"
                      auto-grow
                      solo
                      flat
                      :readonly="true"
                      hide-details="true"
                      label=""
                      class="font-paragraph"
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="expansion-header-reduced-padding"
                  @mouseover="instructorNotesHover = true"
                  @mouseleave="instructorNotesHover = false">
                  <p style="color: #1f4685; text-align: left; max-width: 130px">Instructors Notes</p>
                  <transition name="fade">
                    <p style="padding-left: 5px;" v-if="instructorNotesHover"> - notes from previous instructors, you can add to this!</p>
                  </transition>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-textarea
                    color="#1f4685"
                    v-model="lessonData.instructorNotes"
                    :rules="instructorNotesRules"
                    label=""
                    auto-grow
                    rows="1"
                    class="font-paragraph instructor-notes-textarea"
                    @keyup.enter="instructorNotesEnterHandler"
                  ></v-textarea>
                  <v-btn
                    class="mx-2 save-instructor-notes-button"
                    fab
                    dark
                    small
                    color="#1f4685"
                    :disabled="saveInstructorNotesDisabled"
                    @click="saveInstructorNotes()">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <br>
            <v-divider></v-divider>

            <div class="view-lesson-modal-h2">{{lessonData.lessonPlanRequired ? "PAST LESSONS" : "RESOURCES"}}</div>

            <v-treeview
                :items="pastFiles"
                activatable
                item-key="id"
                open-on-click
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
                  <v-btn v-if="isAdmin" icon @click="deleteLessonFile(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
                <div v-else class="edit-lesson-folder">
                  <p class="folder-name"> {{ item.name }}</p>
                  <v-btn v-if="isAdmin" icon @click.stop="openAddFileDialog(item.name)"><v-icon>mdi-plus</v-icon></v-btn>
                  <v-btn v-if="isAdmin" icon @click.stop="deleteFiles(item.children, item.index)"><v-icon>mdi-delete</v-icon></v-btn>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                          color="#bd0000"
                          v-bind="attrs"
                          v-on="on"
                          v-if="item.children.length === 0"
                      >
                        mdi-alert-circle-outline
                      </v-icon>
                    </template>
                    <span>This folder has no files so will not be saved</span>
                  </v-tooltip>
                </div>
              </template>
            </v-treeview>


          </v-card-text>

          <v-snackbar
            :timeout="3000"
            :value="showSnackbar"
            absolute
            top
            color='#3c882f'
          >
            <v-icon>mdi-check</v-icon>
            {{ snackbarMessage }}
          </v-snackbar>
        </v-card>
        <NewFile ref="newFileDialog" @getFiles="getFileNames(true)"/>
      </template>
    </v-dialog>
    </v-overlay>
  </div>
</template>

<script>
import api from "@/api/api";
import storage_util from "@/common/storage_util";
import NewFile from "@/components/all_lessons/edit_lesson/NewFileDialog";

const noFilesRemaining = "noFilesRemaining";
const setStatusPending = "setStatusPending";

export default {
  name: "LessonAllocationModal",
  components: {NewFile},
  emits: { noFilesRemaining, setStatusPending },
  data() {
    return {
      isAdmin: storage_util.isAdmin(),
      showSnackbar: false,
      snackbarMessage: '',

      allocationId: null,
      lessonId: null,
      dialogWidth: '60vw',
      dialog: false,
      lessonData: null,
      oldInstructorNotes: null, // used to check if instructor notes has been changed
      fileIcons: {
        pdf: 'mdi-file-pdf',
        doc: 'mdi-file-word',
        docx: 'mdi-file-word',
        ppt: 'mdi-file-powerpoint',
        pptx: 'mdi-file-powerpoint',
      },
      pastFiles: [],
      allocationFiles: [],
      openAllocationFiles: [],

      trainingNotesHover: false,
      instructorNotesHover: false,

      instructors: '',

      instructorNotesRules: [
        v => (v.length <= 1000) || 'Max 1000 characters',
      ],
    }
  },

  methods: {

    getFileNames(calledAfterFileUpload) {
      const notSubmittedOrRejected = this.lessonData.state === 'Rejected' || this.lessonData.state === "Not Submitted";
      api.allocationHelpers.getAllocationFiles(this.allocationId)
      .then(res => {
        this.allocationFiles = res.data;
        for (let i = 0; i < this.allocationFiles.length; i++) {
          this.allocationFiles[i].index = i;
          this.openAllocationFiles.push(this.allocationFiles[i].name);
        }
        if (calledAfterFileUpload && notSubmittedOrRejected && this.allocationFiles[0].children.length > 0) {
          this.$emit(setStatusPending, this.allocationId);
          this.lessonData.state = "Pending Approval";
        }
      }).catch(err => {
        console.error(err);
      });

      api.lessonHelpers.getFileNames(this.lessonId)
          .then(res => {
            this.pastFiles = res.data;
            for (let i = 0; i < this.pastFiles.length; i++) {
              this.pastFiles[i].index = i;
            }
          }).catch(err => {
        console.error(err);
      });
    },

    open(allocationId) {
      api.crudAllocations.getOneAllocation(allocationId)
          .then(res => {
            this.lessonData = res.data;
            this.allocationId = allocationId;
            this.lessonId = res.data.lessonId;
            this.getFileNames();
            this.oldInstructorNotes = this.lessonData.instructorNotes; // to detect if user edits instructor notes
            let lessonDate = new Date (res.data.date);
            let year = lessonDate.getFullYear().toString().substring(2);
            this.lessonData.lessonDate = `${lessonDate.getDate()}/${lessonDate.getMonth() + 1}/${year}`;

            let dueDate;
            if (this.lessonData.lessonPlanRequired) {
              dueDate = new Date(this.lessonData.date);
              dueDate.setDate(dueDate.getDate() - process.env.VUE_APP_LESSON_PLAN_DUE);
              year = dueDate.getFullYear().toString().substring(2);
              this.lessonData.dueDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${year}`;
            } else {
              this.lessonData.dueDate = "Not Required";
            }
            this.lessonData.fullTitle = `${this.lessonData.code} ${this.lessonData.yearLevel}.${this.lessonData.lessonNumber} ${this.lessonData.title}`;

            let instructorFullNames = [];
            for (let instructor of res.data.instructors) {
              if (instructor.id !== storage_util.getUserId()) {
                let fullName = instructor.firstName + ' ' + instructor.lastName;
                instructorFullNames.push(fullName);
              }
            }
            this.instructors = this.formatInstructors(instructorFullNames);
            this.dialog = true;
          }).catch(err => {
        console.error(err);
      });
    },

    formatInstructors(instructorFullNames) {
      let instructors;
      if(instructorFullNames.length > 1){
        const lastInstructor = instructorFullNames.pop();
        instructors = instructorFullNames.join(', ');
        instructors += `, and ${lastInstructor}`;
      } else {
        instructors = instructorFullNames.pop();
      }
      return instructors;
    },

    close() {
      this.dialog = false;
    },

    async instructorNotesEnterHandler(event) {
      if (event.ctrlKey) {
        await this.saveInstructorNotes();
      }
    },

    async saveInstructorNotes() {
      await api.crudLessons.updateInstructorNotes(this.lessonId, this.lessonData.instructorNotes);
      this.oldInstructorNotes = this.lessonData.instructorNotes;
      this.displaySnackbar("Instructor notes updated");
    },

    displaySnackbar(message) {
      this.snackbarMessage = message;
      this.showSnackbar = true;
      setTimeout(() => {
        this.showSnackbar = false;
      }, 2000);
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

    async deleteAllocationFile(fileId) {
      try {
        await api.storageApi.deleteFileOfAllocation(this.allocationId, fileId)
        for (let folder of this.allocationFiles) {
          for (let i = 0; i < folder.children.length; i++) {
            if (folder.children[i].id === fileId) {
              folder.children.splice(i, 1);
            }
          }
        }
        if (this.allocationFiles[0].children.length === 0) {
          this.$emit(noFilesRemaining, this.allocationId);
        }
      } catch(err) {
        console.error(err);
      }
    },

    async deleteFiles(files, index) {
      for (let file of files) {
        await api.storageApi.deleteFile(file.id).catch(err => console.error(err))
      }
      this.files.splice(index, 1);
    },

    deleteLessonFile(fileId) {
      api.storageApi.deleteFile(fileId)
          .then(() => {
            for (let folder of this.pastFiles) {
              for (let i = 0; i < folder.children.length; i++) {
                if (folder.children[i].id === fileId) {
                  folder.children.splice(i, 1);
                }
              }
            }
          })
    },

    onResize() {
      if (window.innerWidth > 960) {
        this.dialogWidth = '50vw'
      } else {
        this.dialogWidth = '90vw'
      }
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

  computed: {
    saveInstructorNotesDisabled() {
      return this.lessonData.instructorNotes === this.oldInstructorNotes;
    }
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
@import "../../../public/styles/view-lesson.css";
</style>