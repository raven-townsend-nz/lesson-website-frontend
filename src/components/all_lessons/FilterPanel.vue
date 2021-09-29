<template>
  <v-navigation-drawer
      permanent
      :mini-variant.sync="mini"
      color="#e6e6e6"
      right
      light
      height="100vh"
      width="23vw"
      class="filter-wrapper"

  >
    <v-list>
      <v-list-item v-if="mini" v-on:click="mini = false">
        <v-icon color="#1f4685">mdi-filter</v-icon>
      </v-list-item>
      <v-list-item v-if="!mini" v-on:click="mini = true">
        <v-icon class="lesson-back-burger" color="#1f4685">mdi-close</v-icon>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item>
        <div></div>
        <v-card-title style="padding-left: 0">
          <strong style="font-size: 2rem; padding-right: 0.5vw;">Sort</strong>
        </v-card-title>
      </v-list-item>

      <v-list-item >
        <div></div>
        <v-select
            :items="titleDropdownItems"
            v-model="sortBy"
            placeholder="Select"
            solo
            clearable
            @click:clear="refreshSort()"
            hide-details
        ></v-select>
      </v-list-item>

      <br>
      <v-divider v-if="!mini"></v-divider>
      <v-list-item>
        <div></div>
        <v-card-title style="padding-left: 0">
          <strong style="font-size: 2rem; padding-right: 0.5vw;">Filter</strong>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  elevation="1"
                  icon
                  color="#1f4685"
                  v-on:click="refreshFilter"
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Remove filters</span>
          </v-tooltip>
        </v-card-title>
      </v-list-item>

      <v-list-item >
        <div></div>
        <div class="flex-center-col">
          <p class="filter-titles">Subject</p>
          <v-autocomplete
              color="#1f4685"
              :items="codeFilterItems"
              v-model="codeFilter"
              placeholder="Select"
              multiple
              solo
              clearable
              hide-details
              :search-input.sync="codeInput"
              chips
              @change="codeDropdownHandler"
          ></v-autocomplete>
        </div>
      </v-list-item>

      <v-list-item >
        <div></div>
        <div class="flex-center-col">
          <p class="filter-titles">Year level</p>
          <v-select
              color="#1f4685"
              :items="yearLevelFilterItems"
              v-model="yearLevelFilter"
              placeholder="Select"
              solo
              multiple
              clearable
              hide-details
          ></v-select>
        </div>
      </v-list-item>

      <v-list-item >
        <div></div>
        <div class="flex-center-col">
          <p class="filter-titles">Periods</p>
          <v-select
              color="#1f4685"
              :items="timesFilterItems"
              v-model="timesFilter"
              placeholder="Select"
              solo
              multiple
              clearable
              hide-details
          ></v-select>
        </div>
      </v-list-item>

      <v-list-item >
        <div></div>
        <div class="flex-center-col">
          <p class="filter-titles">Taught</p>
          <v-select
              color="#1f4685"
              :items="whenToTeachFilterItems"
              v-model="whenToTeachFilter"
              placeholder="Select"
              solo
              multiple
              clearable
              hide-details
          ></v-select>
        </div>
      </v-list-item>
      <br>
      <v-list-item class="flex-center-row">
        <div></div>
        <v-btn dark color="#1f4685" v-on:click="applyFilter">
          Apply Filter
        </v-btn>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
import api from "@/api/api";

export default {
  name: "FilterPanel",
  data() {
    return {
      yearNames: ['Basic 1', 'Basic 2', 'Proficiency', 'Advanced', 'Post-Advanced'],
      mini: false,
      sortBy: null,
      titleDropdownItems: [
        {
          text: 'Title (A-Z)',
          value: 'A_Z',
        },
        {
          text: 'Title (Z-A)',
          value: 'Z_A',
        },
        {
          text: 'Time (Ascending)',
          value: 'TIME_ASC',
        },
        {
          text: 'Time (Descending)',
          value: 'TIME_DESC',
        },
        {
          text: 'Taught (A-Z)',
          value: 'WHEN_ASC',
        },
        {
          text: 'Taught (Z-A)',
          value: 'WHEN_DESC',
        }
      ],
      codeFilterItems: [],
      codeFilter: [],
      yearLevelFilterItems: [],
      yearLevelFilter: [],
      timesFilterItems: [],
      timesFilter: [],
      whenToTeachFilterItems: [],
      whenToTeachFilter: [],
      codeInput: '',
    }
  },
  mounted() {
    this.getDropdownItems();
  },

  watch: {
    sortBy: function (newVal) {
      this.$parent.sortLessons(newVal);
    },
  },

  methods: {
    getDropdownItems() {
      api.lessonHelpers.getAllLessonsDropdownItems()
          .then(res => {
            this.codeFilterItems = res.data.codes;
            this.timesFilterItems = res.data.times;
            this.whenToTeachFilterItems = res.data.whenToTeaches;
            this.addYearNames(res.data.yearLevels);
          }).catch( err => {
            console.error(err)
          }
      )
    },

    addYearNames(yearLevels) {
      let result = [];
      for (let i = 0; i < yearLevels.length; i++) {
        result.push({
          value: yearLevels[i],
          text: this.yearNames[i]
        })
      }
      this.yearLevelFilterItems = result;
    },

    refreshSort() {
      console.log('ksdjf')
      this.$parent.refreshSort();
    },

    applyFilter() {
      this.$parent.applyFilter(this.codeFilter, this.yearLevelFilter, this.timesFilter, this.whenToTeachFilter)
    },

    refreshFilter() {
      this.codeFilter = [];
      this.yearLevelFilter = [];
      this.timesFilter = [];
      this.whenToTeachFilter = [];
      this.$parent.refreshFilter();
    },

    codeDropdownHandler() {
      this.codeInput = '';
    }
  }
}
</script>

<style scoped>

</style>