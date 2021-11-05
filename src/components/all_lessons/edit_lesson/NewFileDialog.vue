<template>
  <v-dialog v-model="newFileDialog" max-width="30vw">
    <v-card>
      <v-card-title style="background-color: #1f4685; color: white; padding-block: 1vh">
        <span class="text-h5">Upload Files</span>
        <v-spacer></v-spacer>
        <v-btn class="modal-close-button" icon dark v-on:click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <v-file-input
            color="#1f4685"
            small-chips
            clearable
            multiple
            truncate-length="10"
            accept=".doc,.docx,.pdf,.ppt,.pptx"
            label="File Input"
            v-model="inputFiles"
        ></v-file-input>
      </v-card-text>
      <v-card-actions style="justify-content: center">
        <v-btn
            text
            :loading="uploadButtonLoading"
            style="background:#1f4685; color: white;"
            @click="uploadFiles()"
        >
          <v-icon v-if="!uploadButtonLoading" left>mdi-upload</v-icon>
          Upload
        </v-btn>
      </v-card-actions>

      <v-slide-x-transition>
        <v-alert type="error" v-if="error" >
          {{errorMessage}}
        </v-alert>
      </v-slide-x-transition>

    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/api/api";

const maxFileSize = 5e8; // 5e8 = 500mb

export default {
  name: "NewFile",
  data() {
    return {
      inputFiles: [],
      group: null,
      newFileDialog: false,
      lessonId: null,
      allocationId: null,
      mode: null,
      uploadButtonLoading: false,

      error: false,
      errorMessage: "Something went wrong",
    }
  },
  methods: {
    openNewLessonFile(group, lessonId) {
      this.mode = "lesson";
      this.group = group;
      this.lessonId = lessonId;
      this.newFileDialog = true;
    },

    openNewAllocationFile(allocationId) {
      this.mode = "allocation";
      this.allocationId = allocationId;
      this.newFileDialog = true;
    },

    close() {
      this.newFileDialog = false;
      this.uploadButtonLoading = false;
    },

    uploadErrorMessage(err) {
      if(err.response.data.length > 0) {
        this.errorMessage = err.response.data;
      } else {
        this.errorMessage = "Something went wrong";
      }
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 3000);
    },

    uploadFiles() {
      if (this.inputFiles.length > 0) {
        this.uploadButtonLoading = true;
      }
      try {
        if (this.mode === "lesson") {
          for (let file of this.inputFiles) {
            if (file.size <= maxFileSize) {
              api.storageApi.uploadToArchive(file, file.name, this.lessonId, this.group)
                  .then(() => {
                    this.inputFiles = [];
                    this.$emit('getFiles');
                    this.newFileDialog = false;
                    this.uploadButtonLoading = false;
                  });
            } else {
              this.uploadButtonLoading = false;
              this.errorMessage = "File too large. Max file size is 500mb";
              this.error = true;
              setTimeout(() => {
                this.error = false;
              }, 3000);
            }
          }
        } else {
          for (let file of this.inputFiles) {
            if (file.size <= maxFileSize) {
              api.storageApi.uploadToAllocation(file, file.name, this.allocationId)
                  .then(() => {
                    this.inputFiles = [];
                    this.$emit('getFiles');
                    this.newFileDialog = false;
                    this.uploadButtonLoading = false;
                  });
            } else {
              this.uploadButtonLoading = false;
              this.errorMessage = "File too large. Max file size is 500mb";
              this.error = true;
              setTimeout(() => {
                this.error = false;
              }, 3000);
            }
          }
        }
      } catch (err) {
        this.uploadErrorMessage(err);
        this.uploadButtonLoading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>