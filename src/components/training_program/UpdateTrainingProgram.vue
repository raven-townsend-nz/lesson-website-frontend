<template>
  <v-overlay :opacity="0.8" v-model="dialog">
    <v-dialog v-model="dialog"
              content-class="edit-profile-dialog"
              transition="dialog-top-transition"
              max-width="600">
      <v-btn
        icon
        dark
        style="float: right; z-index: 1; margin: 3vh 3vh 3vh 0;"
        @click="close()"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>

      <v-card class="update-links-card form">
        <v-card-title class="update-links-header">
          <p class="normal-word-break centre">Update Links</p>
        </v-card-title>

        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >

            <p class="white--text">Enter the URL for the 'Open with Google Sheets' button</p>
            <v-text-field
              solo
              v-model="spreadsheetUrl"
              :rules="rules.linkRules"
              prepend-inner-icon="mdi-pencil"
              required
            >
              <template v-slot:append>
                <v-btn icon @click="openShareHelpLink()">
                  <v-icon >mdi-help-circle</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <p class="white--text">Enter the URL to embed the training program</p>
            <v-text-field
              solo
              v-model="embeddedUrl"
              :rules="rules.embeddedRules"
              prepend-inner-icon="mdi-pencil"
              required
            >
              <template v-slot:append>
                <v-btn icon @click="openEmbedHelpLink()">
                  <v-icon >mdi-help-circle</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <v-slide-x-transition>
              <v-alert type="error" v-if="error" >
                {{ errorMessage }}
              </v-alert>
            </v-slide-x-transition>

            <v-btn
              class="mr-4"
              style="width: 100px"
              @click="close">
              Cancel
            </v-btn>
            <v-btn
              :disabled="!valid"
              class="mr-4"
              style="width: 100px"
              @click="changeLinks()"
            >
              Save
            </v-btn>

          </v-form>
        </v-card-text>
        <ConfirmDialog
          ref="confirmDialog"
          @saveChanges="continueToWebsite()"
          @cancelChanges="cancel()"/>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script>
import validation from "@/common/validation";
import ConfirmDialog from "@/components/all_lessons/edit_lesson/ConfirmDialog";
import api from "@/api/api";

export default {
  name: "UpdateTrainingProgram",
  components: {ConfirmDialog},
  data() {
    return {
      dialog: false,
      valid: true,
      error: false,
      errorMessage: '',

      spreadsheetUrl: '',
      embeddedUrl: '',

      rules: validation.trainingProgramRules
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

    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },

    openShareHelpLink() {
      this.updateSpreadsheetLink = true;
      this.$refs.confirmDialog.open("Follow instructions under 'Share a file publicly' and paste the link here", 39)
    },

    openEmbedHelpLink() {
      this.updateEmbedLink = true;
      this.$refs.confirmDialog.open("Follow instructions under 'Publish file' and paste the link here", 39)
    },

    continueToWebsite() {
      if (this.updateSpreadsheetLink) {
        window.open("https://support.google.com/docs/answer/2494822?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Cshare-a-file-publicly");
      } else if (this.updateEmbedLink) {
        window.open("https://support.google.com/docs/answer/183965?visit_id=637671163199954446-2284778539&rd=1");
      }
      this.updateSpreadsheetLink = false;
      this.updateEmbedLink = false;
    },

    cancel() {
      this.updateSpreadsheetLink = false;
      this.updateEmbedLink = false;
    },

    async changeLinks() {
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        try {
          await api.crudResources.setResource('spreadsheetUrl', this.spreadsheetUrl);
          await api.crudResources.setResource('embedSpreadsheetUrl', this.embeddedUrl);
          this.$emit("linksUpdated");
          this.close();
        } catch (err) {
          this.error = true;
          if (err.response.body) {
            this.errorMessage = err.response.body;
          } else {
            this.errorMessage = "Unable to update links";
          }
        }
      }
    }
  }
}
</script>

<style scoped>
@import '../../../public/styles/training-program.css';

</style>