<template>
  <v-overlay :opacity="0.8" v-model="dialog">
    <v-dialog v-model="dialog"
            @close="close"
            scrollable
            :max-width="dialogWidth"
  >

      <v-card>
        <v-toolbar
            color="primary"
            dark
            src="../../assets/login-background.png"
            class="modal-heading"
        >
          <v-toolbar-title class="view-lesson-title">
            {{ modalTitle }}
          </v-toolbar-title>
          <v-btn class="modal-close-button" icon v-on:click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form v-model="valid">
            <div class="view-lesson-modal-h1">{{
                `${code || ''} ${yearLevel || ''}.${lessonNumber || ''} ${title || ''}`
              }}
            </div>
            <div class="full-title-inputs">
              <v-text-field
                  color="#1f4685"
                  outlined
                  v-model="code"
                  :rules="rules.codeRules"
                  label="Subject Code*"
                  class="full-title-input"
              ></v-text-field>
              <v-text-field
                  color="#1f4685"
                  outlined
                  v-model="yearLevel"
                  :rules="rules.yearLevelRules"
                  label="Year Level*"
                  class="full-title-input"
              ></v-text-field>
              <v-text-field
                  color="#1f4685"
                  outlined
                  v-model="lessonNumber"
                  :rules="rules.lessonNumberRules"
                  label="Lesson Number*"
                  class="full-title-input"
              ></v-text-field>
              <v-text-field
                  outlined
                  color="#1f4685"
                  v-model="title"
                  :rules="rules.titleRules"
                  label="Title*"
                  class="full-title-input-title"
              ></v-text-field>
            </div>

            <v-divider></v-divider>

            <div class="view-lesson-modal-h2">DETAILS</div>
            <div class="view-lesson-modal-details-wrapper">
              <div class="view-lesson-modal-details">

                <p class="edit-lesson-details-title"><v-icon>mdi-clock-outline</v-icon>Time: </p>
                <v-text-field
                    single-line
                    color="#1f4685"
                    v-model="time"
                    placeholder="e.g. 1 x 40min Period"
                    @keyup.enter="autofillTimeField"
                    :rules="rules.timeRules"
                    class="view-lesson-modal-edit-details"
                ></v-text-field>
              </div>

              <div class="view-lesson-modal-details">
                <p class="edit-lesson-details-title"><v-icon>mdi-calendar</v-icon>Taught: </p>
                <v-text-field
                    single-line
                    color="#1f4685"
                    v-model="whenToTeach"
                    placeholder="e.g. Term 1"
                    :rules="rules.whenToTeach"
                    class="view-lesson-modal-edit-details"
                ></v-text-field>
              </div>

              <div class="view-lesson-modal-details">
                <v-icon>mdi-notebook-outline</v-icon>
                <p>Lesson plan required: </p>
                <v-checkbox
                    ripple
                    color="#1f4685"
                    v-model="lessonPlanRequired"
                    class="view-lesson-modal-edit-details"
                ></v-checkbox>
              </div>
            </div>

            <div class="view-lesson-cards-wrapper">
              <v-card class="scope-references-card">
                <v-card-title class="view-lesson-card-title">
                  Scope
                </v-card-title>
                <v-card-text class="">
                  <v-textarea
                      color="#1f4685"
                      v-model="scope"
                      :rules="rules.scopeRules"
                      rows="6"
                      counter
                      label=""
                      class="font-paragraph"
                  ></v-textarea>
                </v-card-text>
              </v-card>

              <v-card class="scope-references-card">
                <v-card-title class="view-lesson-card-title">
                  References
                </v-card-title>
                <v-card-text class="">
                  <v-textarea
                      color="#1f4685"
                      v-model="references"
                      :rules="rules.referencesRules"
                      rows="6"
                      counter
                      label=""
                      class="font-paragraph"
                  ></v-textarea>
                </v-card-text>
              </v-card>
            </div>
            <br>
            <v-expansion-panels accordion multiple>
              <v-expansion-panel>
                <v-expansion-panel-header class="expansion-header-reduced-padding"
                                          @mouseover="trainingNotesHover = true"
                                          @mouseleave="trainingNotesHover = false">
                  <p class="accordion-header" style="max-width: 115px">Training Notes</p>
                  <transition name="fade">
                    <p v-if="trainingNotesHover"> - notes from the training office</p>
                  </transition>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-textarea
                      color="#1f4685"
                      v-model="trainingNotes"
                      :rules="rules.trainingNotesRules"
                      auto-grow
                      rows="1"
                      label=""
                      class="font-paragraph"
                      counter
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="expansion-header-reduced-padding"
                  @mouseover="instructorNotesHover = true"
                  @mouseleave="instructorNotesHover = false">
                  <p class="accordion-header" style="max-width: 130px">Instructors Notes</p>
                  <transition name="fade">
                    <p style="padding-left: 5px;" v-if="instructorNotesHover"> - notes from previous instructors</p>
                  </transition>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-textarea
                      color="#1f4685"
                      v-model="instructorNotes"
                      :rules="rules.instructorNotesRules"
                      label=""
                      rows="1"
                      auto-grow
                      class="font-paragraph"
                      counter
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <br>
          </v-form>

          <div class="save-changes-wrapper" >
            <v-slide-x-transition>
              <v-alert type="error" v-if="error">
                {{ errorMessage }}
              </v-alert>
            </v-slide-x-transition>
            <v-btn
                id="save-changes-enabled"
                v-if="valid"
                text
                @click="saveChanges(false)"
            >
              Save Changes
            </v-btn>
            <v-btn
                id="save-changes-disabled"
                v-else
                text
                disabled
            >
              Save Changes
            </v-btn>
          </div>

          <br>
          <v-divider></v-divider>
          <div class="view-lesson-modal-h2">{{lessonPlanRequired ? "PAST LESSONS" : "RESOURCES"}}</div>

          <v-treeview
              v-model="tree"
              :items="files"
              item-key="id"
              transition
              dense
              color="#1f4685"
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.type" class="folder-icon">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else class="folder-icon">
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
                <v-btn icon @click="deleteFile(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
              </div>
              <div v-else class="edit-lesson-folder">
                <p class="folder-name"> {{ item.name }}</p>
                <v-btn icon @click.stop="openAddFileDialog(item.name)"><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn icon @click.stop="deleteFiles(item.children, item.index)"><v-icon>mdi-delete</v-icon></v-btn>
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

          <v-text-field
              v-if="showNewFolder"
              prepend-inner-icon="mdi-folder-plus"
              v-model="newFolderName"
              autofocus
              append-icon="mdi-close"
              @click:append="showNewFolder = false"
              @keyup.enter="createFolder"
              class="create-folder-text-field"
          ></v-text-field>
          <v-btn text @click="showNewFolder = true" color="#1f4685" id="new-folder-button" >new folder</v-btn>

        </v-card-text>

      </v-card>

<!--    NEW FILE DIALOG-->
    <NewFile ref="newFileDialog" @getFiles="getFileNames"/>

    <ConfirmDialog ref="confirmDialog" @saveChanges="saveChanges(true)"/>

  </v-dialog>
  </v-overlay>
</template>

<script>
import api from "@/api/api";
import validation from "@/common/validation";
import NewFile from "@/components/all_lessons/edit_lesson/NewFileDialog";
import ConfirmDialog from "@/components/all_lessons/edit_lesson/ConfirmDialog";

export default {
  name: "LessonModal",
  components: {ConfirmDialog, NewFile},
  data() {
    return {
      modalTitle: '',
      dialogWidth: null,
      dialog: false,
      fileIcons: {
        pdf: 'mdi-file-pdf',
        doc: 'mdi-file-word',
        docx: 'mdi-file-word',
        ppt: 'mdi-file-powerpoint',
        pptx: 'mdi-file-powerpoint',
      },
      showNewFolder: false,
      newFolderName: '',
      rules: validation.lessonRules,
      valid: true,
      tree: [],
      files: [],
      lessonId: null,

      code: '',
      yearLevel: null,
      lessonNumber: null,
      title: '',
      time: '',
      whenToTeach: '',
      lessonPlanRequired: null,
      scope: '',
      references: '',
      trainingNotes: '',
      instructorNotes: '',

      trainingNotesHover: false,
      instructorNotesHover: false,

      errorMessage: '',
      error: false,
    }
  },

  methods: {

    getFileNames() {
      this.files = [];
      api.lessonHelpers.getFileNames(this.lessonId)
      .then(res => {
        this.files = res.data;
        for (let i = 0; i < this.files.length; i++) {
          this.files[i].index = i;
        }
      }).catch(err => {
        console.error(err);
      })
    },

    /**
     * This function is called externally to initialise the modal if we are creating a lesson.
     */
    openCreate() {
      this.lessonId = null;
      this.modalTitle = 'Create Lesson';
      this.code = '';
      this.yearLevel = null;
      this.lessonNumber = null;
      this.title = '';
      this.time = '';
      this.whenToTeach = '';
      this.lessonPlanRequired = false;
      this.scope = '';
      this.references = '';
      this.trainingNotes = '';
      this.instructorNotes = '';
      this.files = [];
      this.dialog = true;
    },

    /**
     * This function is called externally if we are opening the modal to edit a lesson.
     * @param details details of the lesson including code, title, scope etc...
     * @param lessonId the ID of the lesson
     */
    openEdit(details, lessonId) {
      this.modalTitle = 'Edit Lesson';
      this.lessonId = lessonId;
      this.code = details.code || '';
      this.yearLevel = details.yearLevel;
      this.lessonNumber = details.lessonNumber.toString();
      this.title = details.title || '';
      this.time = details.time || '';
      this.whenToTeach = details.whenToTeach || '';
      this.lessonPlanRequired = details.lessonPlanRequired;
      this.scope = details.scope || '';
      this.references = details.references || '';
      this.trainingNotes = details.trainingNotes || '';
      this.instructorNotes = details.instructorNotes || '';
      this.getFileNames();
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    downloadFile({id}) {
      api.lessonHelpers.getFile(id)
        .then(res => {
          window.open(res.data.url);
        })
    },

    saveChanges(confirm) {
      let payload = {
          lessonCode: this.code,
          yearLevel: parseInt(this.yearLevel),
          lessonNumber: parseInt(this.lessonNumber),
          title: this.title,
          lessonPlanRequired: this.lessonPlanRequired,
          time: this.time,
          whenToTeach: this.whenToTeach,
          scope: this.scope,
          trainingNotes: this.trainingNotes,
          instructorNotes: this.instructorNotes,
          references: this.references
      }
      if (this.lessonId) {
        this.updateLesson(payload, confirm);
      } else {
        this.createLesson(payload, confirm);
      }
    },

    updateLesson(payload, confirm) {
      api.crudLessons.updateLesson(this.lessonId, payload, confirm)
          .then(() => {
            let payload = {
              lessonId: this.lessonId,
              title: `${this.code} ${this.yearLevel}.${this.lessonNumber} ${this.title}`,
              time: this.time,
              whenToTeach: this.whenToTeach
            }
            this.$emit('updateLesson', payload);
            this.close();
          }).catch(err => {
        if (err.response.status === 409) {
          this.$refs.confirmDialog.open(`Warning: There is already another lesson with this code, year level, and title.`)
        } else {
          console.error(err);
          this.showError(err);
        }
      });
    },

    createLesson(payload, confirm) {
      api.crudLessons.createLesson(payload, confirm)
      .then(()   => {
        this.$emit('addLesson');
        this.close();
      }).catch(err => {
        if (err.response.status === 409) {
          this.$refs.confirmDialog.open(`Warning: There is already another lesson with this code, year level, and title.`)
        } else {
          console.error(err);
          this.showError(err);
        }
      });
    },

    showError(msg) {
      this.errorMessage = msg;
      this.error = true;
      setTimeout( () => {
        this.error = false;
      }, 4000)
    },

    onResize() {
      if (window.innerWidth > 960) {
        this.dialogWidth = '60vw'
      } else {
        this.dialogWidth = '90vw'
      }
    },

    createFolder() {
      if (this.newFolderName.length > 0) {
        this.files.push({name: this.newFolderName, children: []});
      }
      this.newFolderName = '';
      this.showNewFolder = false;
    },

    async deleteFiles(files, index) {
      for (let file of files) {
        await api.storageApi.deleteFile(file.id).catch(err => console.error(err))
      }
      this.files.splice(index, 1);
    },

    deleteFile(fileId) {
      api.storageApi.deleteFile(fileId)
      .then(() => {
        for (let folder of this.files) {
          for (let i = 0; i < folder.children.length; i++) {
            if (folder.children[i].id === fileId) {
              folder.children.splice(i, 1);
            }
          }
        }
      })
    },

    openAddFileDialog(group) {
      this.$refs.newFileDialog.openNewLessonFile(group, this.lessonId)
    },

    autofillTimeField() {
      this.time = "1 x 40min Period";
    }

  },

  created() {
    window.addEventListener('resize', this.onResize)
    if (window.innerWidth > 960) {
      this.dialogWidth = '60vw'
    } else {
      this.dialogWidth = '90vw'
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style scoped>
@import "../../../public/styles/edit-lesson.css";
</style>