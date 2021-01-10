<template>
  <div class="file-upload-advice">
    <h3>Warehouse loading bay.</h3>Click the button and choose your "Inventory" or "Product Definitions" file in JSON format.
  </div>
  <div class="file-upload-container">
    <label for="file-upload" class="file-upload-label">
      Click to pick a file...
    </label>
    <input 
        id="file-upload"
        class="file-upload-input"
        type="file"
        ref="contentFile"
        @change="onFileChange" 
    />
  </div>
  <div v-if="showUploadConfirmation" class="upload-confirmed">
    Content loaded into store.
    <router-link to="/">Go to items list.</router-link>
  </div>
  <div v-if="showFileLoadError" class="upload-error">
    Upload error! Please pick a JSON file with the correct structure.
  </div>
  <div 
    v-if="isFileLoaded"
    class="confirm-button-container" 
  >
    <div class="file-content-description">
      {{ fileContents }}
    </div>
    <div class="file-load">
      <span class="file-info-advice">
        Store file content without altering existing elements:
      </span>
      <span 
          class="confirm-load-button" 
          @click="confirmFileLoad(false)"
      >
          Load into Store
      </span>
    </div>
    <div class="file-load">
      <span class="file-info-advice">
        Save all file content into store:<br/>
        <strong>Careful!</strong> Previous values will be deleted.
      </span>
      <span 
          class="confirm-load-button confirm-load-button--override" 
          @click="confirmFileLoad(true)"
      >
          Load into Store in Override mode
      </span>
    </div>
    <div class="file-load">
      <span class="file-info-advice">
        Start over:
      </span>
      <span 
        class="confirm-load-button" 
        @click="clearFile"
      >
        Clear file
      </span>
    </div>
  </div>
</template>

<script lang="ts" src="./LoadItems.ts" />
<style scoped lang="scss" src="./LoadItems.scss" />