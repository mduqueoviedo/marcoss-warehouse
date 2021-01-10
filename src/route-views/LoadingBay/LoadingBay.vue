<template>
  <div class="loading-bay">
      <LoadItems />
      <WipeData />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import LoadItems from '@/components/LoadItems/LoadItems.vue';
import WipeData from '@/components/WipeData/WipeData.vue';

@Options({
  components: {
    LoadItems,
    WipeData
  },
})
export default class LoadingBay extends Vue {}
</script>
