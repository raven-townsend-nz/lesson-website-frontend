<template>
  <v-dialog
      v-model="saveChangesConfirmDialog"
      persistent
      :max-width="width"
  >
    <v-card>
      <v-card-title style="word-break: break-word" :class="getClass()">
        <div :class="getMessageClass()">{{ message }}</div>
      </v-card-title>
      <v-card-actions style="display: flex; flex-direction: row; justify-content: center">
        <v-btn
            style="color: red"
            plain
            @click="saveChangesConfirmDialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
            style="color: #1f4685"
            plain
            @click="saveChanges"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  data() {
    return {
      saveChangesConfirmDialog: false,
      message: null,
      width: "40vw",
      alignLeft: false
    }
  },
  methods: {
    saveChanges() {
      this.$emit('saveChanges')
      this.saveChangesConfirmDialog = false;
    },

    cancelChanges() {
      this.$emit('cancelChanges')
      this.saveChangesConfirmDialog = false;
    },

    open(message, width, alignLeft) {
      this.alignLeft = alignLeft;
      this.message = message;
      if (width !== undefined) {
        this.width = width + "vw";
      }
      this.saveChangesConfirmDialog = true;
    },

    getClass() {
      if (this.alignLeft) {
        return "";
      } else {
        return "confirm-text-centre";
      }
    },

    getMessageClass() {
      if (this.alignLeft) {
        return "preserve-whitespace";
      } else {
        return "";
      }
    }
  }
}
</script>

<style scoped>
@import '../../../../public/styles/confirm-dialog.css';
</style>