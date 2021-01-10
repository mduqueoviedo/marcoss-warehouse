<template>
  <div class="inventory-list">
    <h1>Inventory List</h1>
  </div>
  <div class="inventory-list-container">
    <div 
      v-for="item of itemsList"
      class="inventory-card"
      :class="{'inventory-card--empty': item.stock === 0}"
      :key="item.id"
    >
      <div class="inventory-title">
        {{item.name}}
      </div>
      <div class="inventory-field">
        <span>Stock:</span> {{item.stock}}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./InventoryList.ts" />
<style scoped lang="scss" src="./InventoryList.scss" />
