<template>
  <div class="lesson-allocations-wrapper">
    <v-card class="lesson-allocations-table-wrapper">
      <v-card-title class="lesson-allocations-table-title">
        <strong style="font-size: 3rem; width: 100%">Lesson Allocations</strong>

      </v-card-title>
      <br>

      <v-card-text class="no-padding">
      <v-row>

        <v-col
          class="no-padding toolbar-col"
          cols="12"
          lg="3"
          md="4"
          sm="12">
          <v-btn dark color="primary" class="create-allocation-button margin-12-top" @click="openCreateAllocation">
            <v-icon>mdi-plus</v-icon> Allocate Lessons
          </v-btn>
        </v-col>


        <v-col
          class="no-padding toolbar-col"
          cols="12"
          lg="2"
          md="4"
          sm="12">
          <v-btn-toggle
            dense
            v-model="showPast"
            mandatory
            @change="getLessons"
            class="lesson-allocation-filter-toggle margin-12-top"
          >
            <v-btn
              active-class="primary-button"
              color="#f5f5f5"
              :value="true"
              style="width: 100px">
              Past
            </v-btn>
            <v-btn
              active-class="primary-button"
              color="#f5f5f5"
              :value="false"
              style="width: 100px">
              Current
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-col
          class="no-padding toolbar-col"
          cols="12"
          lg="3"
          md="4"
          sm="12">
          <v-menu
            :close-on-content-click="false"
            offset-y>
            <template v-slot:activator="{ on, attrs }">

              <v-btn
                class="filter-button"
                :color="filterIconColor()"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-filter</v-icon>
                Filter by status
              </v-btn>

            </template>
            <div class="status-filter-dropdown">

              <v-list v-for="status in statusList" v-bind:key="status.id" class="no-vertical-padding">
                <v-list-item :class="filterDropDownClass(status.active)" @click="handleStatusSelection(status, false)">
                  <v-list-item-action>
                    <v-simple-checkbox :ripple="false" @click="handleStatusSelection(status, true)" v-model="status.active"/>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{status.text}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

            </div>
          </v-menu>

        </v-col>
        <v-col
          class="no-padding toolbar-col"
          cols="12"
          lg="4"
          md="12"
          sm="12">

          <v-text-field
            style="margin-right: 50px; margin-left: 20px"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search..."
            single-line
            hide-details
            clearable
            color="#1f4685"
            ></v-text-field>
        </v-col>
      </v-row>
      <br>

      <v-data-table
          :headers="headers"
          :items="lessonAllocationsView"
          item-key="id"
          :search="search"
          disable-pagination
          fixed-header
          hide-default-footer
          :item-class="itemRowBackground"
          :loading="loading"
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

        <template v-slot:item.actions="{ item }">
          <v-icon
              @click="deleteAllocation(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      </v-card-text>
    </v-card>
    <EditAllocation ref="editAllocationDialog" @updateAllocation="updateAllocation"/>
    <CreateLessonAllocation ref="createDialog" @created="getLessons(); displaySnackbar()"/>
    <v-dialog
        v-model="deleteDialog"
        max-width="380"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ `Are you sure you want to delete this allocation?` }}
        </v-card-title>
        <v-card-text>
          All information about the allocation will be deleted
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
    <v-snackbar
        :timeout="3000"
        :value="showSnackbar"
        absolute
        top
        color='#3c882f'
    >
      <v-icon>mdi-check</v-icon>
      Allocation created successfully
    </v-snackbar>
  </div>
</template>

<script>
import CreateLessonAllocation from "./CreateLessonAllocation";
import api from "@/api/api";
import EditAllocation from "@/components/lesson_allocations/EditAllocation";
import events from "@/common/events";


export default {
  name: "AllLessonAllocations",
  title: '17 SQN | Lesson Allocations',
  components: {EditAllocation, CreateLessonAllocation},

  data() {
    return {
      test: true,
      loading: true,
      headers: [
        {
          text: 'Title',
          align: 'start',
          value: 'fullTitle',
        },
        { text: 'Lesson Plan Due', value: 'dueDate'},
        { text: 'Lesson Date', value: 'lessonDate'},
        { text: 'Submission Status', value: 'state'},
        { text: 'Instructors', value: 'instructors'},
        { text: 'Actions', value: 'actions', filterable: false, sortable: false },
      ],
      lessonAllocations: [],
      lessonAllocationsView: [],
      search: '',
      deleteDialog: false,
      deleteAllocationId: null,
      showPast: false,
      showSnackbar: false,
      statusWhitelist: new Set(["Not Submitted", "Pending Approval", "Approved", "Rejected"]),
      statusList: [
        { text: "Not Submitted", id: 1, active: true },
        { text: "Pending Approval", id: 2, active: true },
        { text: "Approved", id: 3, active: true },
        { text: "Rejected", id: 4, active: true }
      ],
    }
  },

  mounted() {
    this.getLessons();
  },


  methods: {
    getLessons() {
      api.crudAllocations.getAllAllocations(this.showPast)
          .then(res => {
            this.lessonAllocations = [];
            for (let allocation of res.data) {
              this.formatAllocation(allocation);
              this.lessonAllocations.push(allocation);
            }

            this.lessonAllocationsView = this.lessonAllocations.filter(allocation => this.statusWhitelist.has(allocation.state));
            this.loading = false;
          }).catch(err => {
        console.error(err);
      })
    },

    formatAllocation(allocation) {
      let instructorFullNames = [];
      allocation.instructorSlacks = [];
      for (let instructor of allocation.instructors) {
        let fullName = instructor.firstName + ' ' + instructor.lastName;
        instructorFullNames.push(fullName);
        allocation.instructorSlacks.push({slackId: instructor.slackId, fullName: fullName});
      }
      let lessonDate = new Date(allocation.date);
      lessonDate = `${lessonDate.getDate()}/${lessonDate.getMonth() + 1}/${lessonDate.getFullYear()}`;

      let dueDate;
      if (allocation.lessonPlanRequired) {
        dueDate = new Date(allocation.date);
        dueDate.setDate(dueDate.getDate() - process.env.VUE_APP_LESSON_PLAN_DUE);
        dueDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;
      } else {
        dueDate = "N/A";
      }



      if (instructorFullNames.length === 2) {
        allocation.instructors = instructorFullNames.join(" and ");
      } else if (instructorFullNames.length > 1) {
        const lastInstructor = instructorFullNames.pop();
        allocation.instructors = instructorFullNames.join(', ');
        allocation.instructors += `, and ${lastInstructor}`;
      } else {
        allocation.instructors = instructorFullNames.pop();
      }

      allocation.dueDate = dueDate;
      allocation.lessonDate = lessonDate;
      allocation.loading = false;
      allocation.fullTitle = `${allocation.code} ${allocation.yearLevel}.${allocation.lessonNumber} ${allocation.title}`;
    },

    filterLessons() {
      this.lessonAllocationsView = this.lessonAllocations.filter(
        allocation => this.statusWhitelist.has(allocation.state)
      );
    },

    displaySnackbar() {
      this.showSnackbar = true;
      setTimeout(() => {
        this.showSnackbar = false;
      }, 2000);
    },

    openCreateAllocation() {
      this.$refs.createDialog.open();
    },

    openAllocation(allocation) {
      let allocationId = allocation.id;
      allocation.loading = true;
      this.$refs.editAllocationDialog.open(allocationId);
      allocation.loading = false;
    },

    deleteAllocation(allocation) {
      this.deleteAllocationId = allocation.id;
      this.deleteDialog = true;
    },

    async sendRemovedNotifications(allocation) {
      for (let obj of allocation.instructorSlacks) {
        let message = "*Lesson Notification*\nYou are no longer teaching the following lesson: \n";
        message += `*${allocation.fullTitle}*\n`;
        try {
          await api.slackApi.sendMessageTo(message, obj.slackId, obj.fullName);
        } catch (err) {
          let message = err.response.data.length > 0 ? err.response.data : "Unable to notify instructors";
          console.log(message);
        }
      }
    },

    async confirmDelete() {
      try {
        await api.crudAllocations.deleteAllocation(this.deleteAllocationId);
        this.deleteDialog = false;
        const deletedAllocation = this.lessonAllocations.find(allocation => allocation.id == this.deleteAllocationId);
        await this.sendRemovedNotifications(deletedAllocation);
        console.log(deletedAllocation);
        this.lessonAllocations = this.lessonAllocations.filter(allocation => allocation.id !== this.deleteAllocationId);
        this.lessonAllocationsView = this.lessonAllocationsView.filter(allocation => allocation.id !== this.deleteAllocationId);
      } catch {
        const event = new Event(events.ALLOCATION_NOT_DELETED);
        window.dispatchEvent(event);
      }
    },

    cancelDelete() {
      this.deleteDialog = false;
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

    filterDropDownClass(isActive) {
      if (isActive) {
        return "primary--text v-list-item--active v-list-item--link no-vertical-padding";
      } else {
        return "no-vertical-padding";
      }
    },

    filterIconColor() {
      if (this.statusWhitelist.size >= 4) {
        return "rgb(245, 245, 245)";
      } else {
        return "primary";
      }
    },

    handleStatusSelection(status, calledFromCheckboxClick) {
      if (!calledFromCheckboxClick) {
        status.active = !status.active;
      }
      if (status.active) {
        this.statusWhitelist.add(status.text);
      } else {
        this.statusWhitelist.delete(status.text);
      }
      this.filterLessons();
    },

    async updateAllocation(allocationId, state) {
      let rawAllocation = (await api.crudAllocations.getOneAllocation(allocationId)).data;
      this.formatAllocation(rawAllocation);
      for (let allocation of this.lessonAllocationsView) {
        if (allocation.id === allocationId) {
          allocation.instructors = rawAllocation.instructors;
          allocation.date = rawAllocation.date;
          allocation.lessonDate = rawAllocation.lessonDate;
          allocation.dueDate = rawAllocation.dueDate;
          if (state !== null) {
            allocation.state = rawAllocation.state;
          }
        }
      }
    },
  }
}
</script>

<style scoped>
@import "../../../public/styles/lesson-allocations.css";
</style>