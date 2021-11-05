<template>

  <div class="my-lessons-wrapper">
    <v-card class="my-lessons-table-wrapper" id="table-wrapper">

      <v-card-title>
        <strong style="font-size: 3rem">My Lessons</strong>
        <v-spacer></v-spacer>

        <v-btn-toggle
          dense
          v-model="showPast"
          mandatory
          @change="getMyLessons"
          class="lesson-allocation-filter-toggle margin-12-top"
        >
          <v-btn
            active-class="primary-button"
            color="#f5f5f5"
            :value="pastValue"
            style="width: 100px">
            Past
          </v-btn>
          <v-btn
            active-class="primary-button"
            color="#f5f5f5"
            :value="currentValue"
            style="width: 100px">
            Current
          </v-btn>
        </v-btn-toggle>

        <v-text-field
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
          :items="myLessons"
          item-key="id"
          :search="search"
          disable-pagination
          fixed-header
          hide-default-footer
          :item-class="itemRowBackground"
      >
        <template v-slot:item.fullTitle="{ item }">
          <v-btn
              dark
              rounded
              class="lesson-btn"
              color="#1f4685"
              :loading="item.loading"
              v-on:click="openAllocation(item)"
          >
            {{ item.fullTitle }}
          </v-btn>
        </template>

        <template v-slot:item.dueDate="{ item }">
          <p class="no-margin" v-if="isDue(item) < 0 && item.state === 'Not Submitted'">Overdue by {{ Math.abs(isDue(item)) }} day(s)</p>
          <p class="no-margin" v-else>{{ item.dueDate }}</p>
        </template>

        <template v-slot:item.state="{ item }">
          <v-chip
              :color="getColor(item.state)"
              dark
          >
            {{ item.state }}
          </v-chip>
        </template>
      </v-data-table>

    </v-card>
    <ViewMyLessonModal ref="viewMyLessonModal"
                       @setStatusPending="setStatusPending"
                       @noFilesRemaining="setStatusNotSubmitted"/>
  </div>
</template>

<script>
import api from "@/api/api";
import storage_util from "@/common/storage_util";
import ViewMyLessonModal from "@/components/my_lessons/ViewAllocation";

export default {
  name: "AllLessons",
  components: {ViewMyLessonModal},
  title: '17 SQN | My Lessons',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Title',
          align: 'start',
          value: 'fullTitle',
        },
        { text: 'Lesson Plan Due', value: 'dueDate'},
        { text: 'Lesson Date', value: 'lessonDate'},
        { text: 'Submission Status', value: 'state'},
        { text: 'Additional Instructors', value: 'instructors'}
      ],
      myLessons: [],
      lessonsView: [],
      showPast: false,

      pastValue: true,
      currentValue: false
    }
  },

  mounted() {
    this.getMyLessons();
  },


  methods: {

    getMyLessons() {
      this.myLessons = [];
      api.crudAllocations.getUserAllocations(storage_util.getUserId(), this.showPast)
      .then(res => {
        for (let allocation of res.data){ // for all allocations of this user
          let instructorFullNames = [];
          for (let instructor of allocation.instructors) {
            if (instructor.id !== storage_util.getUserId()) {
              let fullName = instructor.firstName + ' ' + instructor.lastName;
              instructorFullNames.push(fullName);
            }
          }

          let lessonDate = new Date (allocation.date);
          lessonDate = `${lessonDate.getDate()}/${lessonDate.getMonth() + 1}/${lessonDate.getFullYear()}`;

          let dueDate;
          if (allocation.lessonPlanRequired) {
            dueDate = new Date(allocation.date);
            dueDate.setDate(dueDate.getDate() - process.env.VUE_APP_LESSON_PLAN_DUE);
            dueDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;
          } else {
            dueDate = "N/A";
          }

          if (instructorFullNames.length === 2){
            allocation.instructors = instructorFullNames.join(" and ");
          } else if(instructorFullNames.length > 1) {
            const lastInstructor = instructorFullNames.pop();
            allocation.instructors = instructorFullNames.join(', ');
            allocation.instructors += `, and ${lastInstructor}`;
          } else {
            allocation.instructors = instructorFullNames.pop();
          }


          allocation.dueDate = dueDate;
          allocation.lessonDate = lessonDate;
          allocation.fullTitle = `${allocation.code} ${allocation.yearLevel}.${allocation.lessonNumber} ${allocation.title}`;
          allocation.loading = false;
          this.myLessons.push(allocation);


        }
      }).catch(err => {
        console.error(err);
      })
    },

    openAllocation(allocation) {
      let allocationId = allocation.id;
      allocation.loading = true;
      this.$refs.viewMyLessonModal.open(allocationId);
      allocation.loading = false;
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

    isDue(allocation) {
      let dueDate = new Date (allocation.date);
      dueDate.setDate(dueDate.getDate() - process.env.VUE_APP_LESSON_PLAN_DUE);
      let curDate = new Date();
      curDate.setDate(curDate.getDate() - 1);
      const diffTime = dueDate - curDate;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },

    itemRowBackground: function (allocation) {
      let isRed = (this.isDue(allocation) < 0) && (allocation.state === 'Not Submitted');
      return (isRed) ? 'red-row' : 'style-2';
    },

    setStatusNotSubmitted(allocationId) {
      for (let allocation of this.myLessons) {
        if (allocation.id === allocationId) {
          allocation.state = "Not Submitted";
        }
      }
    },

    setStatusPending(allocationId) {
      for (let allocation of this.myLessons) {
        if (allocation.id === allocationId) {
          allocation.state = "Pending Approval";
        }
      }
    }

  },

}
</script>

<style scoped>
@import "../../../public/styles/my-lessons.css";
</style>