<template>
  <div class="home">
    <div 
      v-if="isStoreEmpty"
      class="empty-warning"
    >
      Yikes! It seems the Warehouse is empty.<br />
      Would you like to fill it in the <router-link to="/loading-bay">loading bay?</router-link>
    </div>
    <div v-else>
      <ProductList />
      <InventoryList />
    </div>
  </div>
</template>

<script lang="ts" src="./Home.ts" />
<style scoped lang="scss" src="./Home.scss" />
