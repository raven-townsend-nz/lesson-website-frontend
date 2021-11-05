<template>

  <div class="all-lessons-wrapper">
    <v-card class="all-lessons-table-wrapper" id="table-wrapper">
      <v-card-title>
        <strong class="all-lessons-title">All Lessons</strong>

        <v-btn v-if="isAdmin" dark color="#0064b4" class="create-lesson-button" @click="openCreateLesson">
          <v-icon>mdi-plus</v-icon>Create Lesson
        </v-btn>
        <v-text-field
            class="all-lesson-search"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search..."
            single-line
            hide-details
            clearable
            color="#1f4685"
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="lessonsView"
          item-key="id"
          :search="search"
          disable-pagination
          fixed-header
          hide-default-footer
          :loading="loading"
      >
          <template v-slot:item.fullTitle="{ item }">
            <v-hover v-slot="{ hover }">
              <v-btn
                  dark
                  rounded
                  class="lesson-btn"
                  color="#1f4685"
                  :loading="item.loading"
                  v-on:click="openLesson(item)"
              >
                {{ item.fullTitle }}
                <v-icon v-if="hover && isAdmin" style="margin-inline-start: 1vw">mdi-pencil</v-icon>
              </v-btn>
            </v-hover>
          </template>

        <template v-if="isAdmin" v-slot:item.actions="{ item }">
          <v-icon
              @click="deleteLesson(item.id)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

    </v-card>
    <FilterPanel/>
    <ViewLessonModal ref="viewLessonModal"/>
    <EditLessonModal ref="lessonModal" @updateLesson="updateLesson" @addLesson="getAllLessons"/>
    <v-dialog
        v-model="deleteDialog"
        max-width="380"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ `Are you sure you want to delete this lesson?` }}
        </v-card-title>
        <v-card-text>
          All information about the lesson and its files will be deleted
        </v-card-text>
        <v-card-actions style="display: flex; flex-direction: row; justify-content: center">
          <v-btn
              class="ma-1"
              style="color: grey"
              plain
              @click="deleteDialog = false"
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
  </div>
</template>

<script>
import api from "@/api/api";
import storage_util from "@/common/storage_util";
import FilterPanel from "@/components/all_lessons/FilterPanel";
import ViewLessonModal from "@/components/all_lessons/ViewLessonDialog";
import EditLessonModal from "@/components/all_lessons/LessonModal";
import events from "@/common/events";


export default {
  name: "AllLessons",
  components: {EditLessonModal, ViewLessonModal, FilterPanel},
  title: '17 SQN | All Lessons',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'fullTitle',
        },
        { text: 'Periods', value: 'time', filterable: false, sortable: false },
        { text: 'Taught', value: 'whenToTeach', filterable: false, sortable: false },

      ],
      lessonsAll: [],
      lessonsView: [],
      deleteDialog: false,
      deleteLessonId: null,
      loading: true,
      isAdmin: storage_util.isAdmin()
    }
  },

  mounted() {
    this.getAllLessons();
    if(this.isAdmin){
      this.headers.push({ text: 'Actions', value: 'actions', filterable: false, sortable: false });
    }
  },


  methods: {

    getAllLessons() {
      api.crudLessons.getAllLessons()
      .then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i ++) {
          const raw = data[i];
          data[i].fullTitle = `${raw.code} ${raw.yearLevel}.${raw.lessonNumber} ${raw.title}`;
          data[i].loading = false;
        }
        data.sort((a, b) => (a.code).localeCompare(b.code) || a.yearLevel - b.yearLevel  ||  a.lessonNumber - b.lessonNumber)
        this.lessonsAll = data;
        this.lessonsView = data;
        this.loading = false;
      }).catch(err => {
        console.error(err);
      })
    },

    sortLessons(sortOption) {
      switch (sortOption) {
        case 'A_Z':
          this.lessonsView.sort((a, b) => (a.code).localeCompare(b.code) || a.yearLevel - b.yearLevel  ||  a.lessonNumber - b.lessonNumber)
          break;
        case 'Z_A':
          this.lessonsView.sort((a, b) => (b.code).localeCompare(a.code) || b.yearLevel - a.yearLevel  ||  b.lessonNumber - a.lessonNumber)
          break;
        case 'TIME_ASC':
          this.lessonsView.sort((a, b) => (a.time).localeCompare(b.time))
          break;
        case 'TIME_DESC':
          this.lessonsView.sort((a, b) => (b.time).localeCompare(a.time))
          break;
        case 'WHEN_ASC':
          this.lessonsView.sort((a, b) => (a.whenToTeach).localeCompare(b.whenToTeach))
          break;
        case 'WHEN_DESC':
          this.lessonsView.sort((a, b) => (b.whenToTeach).localeCompare(a.whenToTeach))
          break;
      }
    },

    refreshSort() {
      this.lessonsView.sort((a, b) => (a.code).localeCompare(b.code) || a.yearLevel - b.yearLevel  ||  a.lessonNumber - b.lessonNumber)
      this.sortBy = null;
    },

    applyFilter(codeFilter, yearLevelFilter, timesFilter, whenToTeachFilter) {
      this.lessonsView = this.lessonsAll;

      this.lessonsView = this.lessonsView.filter((item) => {
        return (codeFilter.length === 0 || codeFilter.includes(item.code));
      });

      this.lessonsView = this.lessonsView.filter((item) => {
        return (yearLevelFilter.length === 0 ||  yearLevelFilter.includes(item.yearLevel));
      });

      this.lessonsView = this.lessonsView.filter((item) => {
        return (timesFilter.length === 0 || timesFilter.includes(item.time));
      });

      this.lessonsView = this.lessonsView.filter((item) => {
        return (whenToTeachFilter.length === 0 || whenToTeachFilter.includes(item.whenToTeach));
      });
    },

    refreshFilter() {
      this.lessonsView = this.lessonsAll;
      this.lessonsView.sort((a, b) => (a.code).localeCompare(b.code) || a.yearLevel - b.yearLevel  ||  a.lessonNumber - b.lessonNumber)
    },

    openCreateLesson() {
      this.$refs.lessonModal.openCreate();

    },

    openLesson(lesson) {
      let lessonId = lesson.id;
      lesson.loading = true;
      api.crudLessons.getOneLesson(lessonId)
          .then(res => {
            if (this.isAdmin) {
              this.$refs.lessonModal.openEdit(res.data, lessonId);
            } else {
              this.$refs.viewLessonModal.open(res.data, lessonId);
            }
            lesson.loading = false;
          }).catch(err => {
        console.error(err);
        lesson.loading = false;
      });

    },

    updateLesson(payload) {
      for (let i = 0; i < this.lessonsView.length; i++) {
        if (this.lessonsView[i].id === payload.lessonId) {
          this.lessonsView[i].fullTitle = payload.title;
          this.lessonsView[i].time = payload.time;
          this.lessonsView[i].whenToTeach = payload.whenToTeach;
        }
      }

      for (let i = 0; i < this.lessonsAll.length; i++) {
        if (this.lessonsAll[i].id === payload.lessonId) {
          this.lessonsAll[i].fullTitle = payload.title;
          this.lessonsAll[i].time = payload.time;
          this.lessonsAll[i].taught = payload.whenToTeach;
        }
      }
    },

    deleteLesson(lessonId) {
      this.deleteLessonId = lessonId;
      this.deleteDialog = true;
    },

    confirmDelete() {
      api.crudLessons.deleteLesson(this.deleteLessonId)
      .then(() => {
        this.lessonsAll = this.lessonsAll.filter(lesson => lesson.id !== this.deleteLessonId);
        this.lessonsView = this.lessonsView.filter(lesson => lesson.id !== this.deleteLessonId);
        this.deleteDialog = false;
      })
      .catch(err => {
        console.error(err);
        const event = new Event(events.LESSON_NOT_DELETED);
        window.dispatchEvent(event);
        this.deleteDialog = false;
      })
    }

  },

}
</script>

<style scoped>
@import "../../../public/styles/all-lessons.css";
</style>