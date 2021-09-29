<template>
  <div>
    <v-card>
      <v-card-title>
        <strong style="font-size: 3rem">Training Program</strong>

        <v-btn
          style="margin-left: 15px; padding-left: 10px; padding-right: 10px "
          @click="goToSpreadsheet()">
          <v-icon color="#188038">
            mdi-google-spreadsheet
          </v-icon>
          Open with Google Sheets
        </v-btn>

        <v-tooltip
          open-delay="500"
          bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              v-if="isAdmin"
              style="margin-left: 15px; padding-left: 10px; padding-right: 10px "
              @click="openUpdateLinkDialog()">
              <v-icon>
                mdi-pencil
              </v-icon>
              Update Training Program File
            </v-btn>
          </template>
          <span>When the file for the training program updates each year, the<br>
                links to the file will need to be updated for this page to work</span>
        </v-tooltip>

      </v-card-title>
      <div v-if="linksLoaded">
        <iframe style="width: 100vw; min-height: 91vh"
                :src="embeddedUrl + '?widget=true&amp;headers=false'"></iframe>
      </div>

      <UpdateTrainingProgram ref="updateLinkDialog" @linksUpdated="reloadPage"/>
    </v-card>
  </div>
</template>

<script>
import storage_util from "../../common/storage_util";
import UpdateTrainingProgram from "./UpdateTrainingProgram";
import api from "../../api/api";


export default {
  name: "TrainingProgram",
  components: {UpdateTrainingProgram},
  title: "17 SQN | Training Program",

  data() {
    return {
      isAdmin: storage_util.isAdmin(),
      linksLoaded: false,

      updateSpreadsheetLink: false,
      updateEmbedLink: false,

      spreadsheetUrl: '',
      embeddedUrl: ''
    }
  },

  mounted() {
    this.getLinks();
  },

  methods: {

    async getLinks() {
      try {
        let res = await api.crudResources.getResource('spreadsheetUrl');
        this.spreadsheetUrl = res.data.value;
        res = await api.crudResources.getResource('embedSpreadsheetUrl');
        this.embeddedUrl = res.data.value;
        this.linksLoaded = true;
      } catch (err) {
        console.error(err);
      }
    },

    goToSpreadsheet() {
      window.open(this.spreadsheetUrl);
    },

    openUpdateLinkDialog() {
      this.updateSpreadsheetLink = true;
      this.$refs.updateLinkDialog.open();
    },

    async reloadPage() {
      await this.getLinks();
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/training-program.css';
</style>