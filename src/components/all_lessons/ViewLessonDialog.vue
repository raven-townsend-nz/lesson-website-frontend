<template>
  <v-overlay :opacity="0.8" v-model="dialog">
    <v-dialog v-model="dialog"
              @close="close"
              scrollable
              :max-width="dialogWidth"
              v-if="lessonData"
    >
      <template >
        <v-card>
          <v-toolbar
              color="primary"
              dark
              src="../../assets/login-background.png"
          >
            <v-toolbar-title class="view-lesson-title">
              View Lesson
              <v-btn class="modal-close-button" icon v-on:click="close"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div class="view-lesson-modal-h1">{{ lessonData.fullTitle }}</div>
            <v-divider></v-divider>
            <div class="view-lesson-modal-h2">DETAILS</div>
            <div class="view-lesson-modal-details" v-if="lessonData.time">
              <v-icon>mdi-clock</v-icon>
              <p>Time: {{ lessonData.time }}</p>
            </div>
            <div class="view-lesson-modal-details" v-if="lessonData.whenToTeach">
              <v-icon>mdi-calendar</v-icon>
              <p>Taught: {{ lessonData.whenToTeach }}</p>
            </div>
            <div class="view-lesson-modal-details" v-if="lessonData.lessonPlanRequired">
              <v-icon>mdi-clipboard</v-icon>
              <p>Lesson plan required: {{ lessonData.lessonPlanRequired? 'Yes' : 'No' }}</p>
            </div>

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
                    solo
                    flat
                    :readonly="true"
                    hide-details="true"
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
                  <p style="color: #1f4685; text-align: left; max-width: 115px;">Training Notes</p>
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
                      :readonly="true"
                      hide-details="true"
                      solo
                      flat
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
                  <p style="color: #1f4685; text-align: left; max-width: 130px;">Instructors Notes</p>
                  <transition name="fade">
                    <p style="padding-left: 5px;" v-if="instructorNotesHover"> - notes from previous instructors</p>
                  </transition>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-textarea
                      color="#1f4685"
                      v-model="lessonData.instructorNotes"
                      :readonly="true"
                      rows="1"
                      solo
                      flat
                      auto-grow
                      hide-details="true"
                      label=""
                      class="font-paragraph"
                  ></v-textarea>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <br>
            <v-divider></v-divider>
            <div class="view-lesson-modal-h2">{{lessonData.lessonPlanRequired ? "PAST LESSONS" : "RESOURCES"}}</div>

            <v-treeview
                v-model="tree"
                :items="files"
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
                <a
                    v-if="item.type"
                    href="#"
                    v-text="item.name"
                    v-on:click.stop="downloadFile(item)"
                ></a>
                <p class="folder-name" v-else> {{ item.name }}</p>
              </template>
            </v-treeview>


          </v-card-text>
        </v-card>
      </template>

    </v-dialog>
  </v-overlay>
</template>

<script>
import api from "@/api/api";

export default {
  name: "ViewLessonModal",
  data() {
    return {
      dialogWidth: '50vw',
      dialog: false,
      lessonData: null,

      trainingNotesHover: false,
      instructorNotesHover: false,

      fileIcons: {
        pdf: 'mdi-file-pdf',
        doc: 'mdi-file-word',
        docx: 'mdi-file-word',
        ppt: 'mdi-file-powerpoint',
        pptx: 'mdi-file-powerpoint',
      },
      tree: [],
      files: [],
      lessonId: null,
    }
  },

  methods: {

    getFileNames() {
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

    open(data, lessonId) {
      this.lessonData = data;
      this.lessonData.fullTitle = `${this.lessonData.code} ${this.lessonData.yearLevel}.${this.lessonData.lessonNumber} ${this.lessonData.title}`;
      this.lessonId = lessonId;

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

    onResize() {
      if (window.innerWidth > 960) {
        this.dialogWidth = '50vw'
      } else {
        this.dialogWidth = '90vw'
      }
    }

  },

  created() {
    window.addEventListener('resize', this.onResize);
    if (window.innerWidth > 960) {
      this.dialogWidth = '50vw'
    } else {
      this.dialogWidth = '90vw'
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
}
</script>

<style scoped>
@import "../../../public/styles/view-lesson.css";
</style>