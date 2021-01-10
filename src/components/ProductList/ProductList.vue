<template>
  <div>
    <h1>Product List</h1>
  </div>
  <div class="products-container">
    <div 
      v-for="(product, index) of productsList"
      class="product-card"
      :key="index"
    >
      <div class="product-title">
        <h3>{{product.name}}</h3>
      </div>
      <div class="product-field">
        <span>Price:</span> € {{product.price}}
      </div>
      <div class="product-field">
        <span>Availability:</span> {{product.availableAmount}}
      </div>
      <div 
        v-if="product.containedArticles.length"
        class="product-pieces-container"
      >
        Includes these pieces: 
        <ul>
          <li 
            v-for="(article, index) of product.containedArticles"
            class="article-card"
            :key="index"
          >
              {{article.amount}} x {{article.name}}
          </li>
        </ul>
      </div>
      <div 
        class="sell-button"
        :class="{'disabled': product.availableAmount <= 0}"
        @click="sellProduct(product.name)"
      >
        Sell
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProductList.ts" />
<style scoped lang="scss" src="./ProductList.scss" />
