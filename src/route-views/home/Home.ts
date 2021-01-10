import { Options, Vue } from 'vue-class-component';
import InventoryList from '@/components/InventoryList/InventoryList.vue';
import ProductList from '@/components/ProductList/ProductList.vue';
import { store } from '@/store/warehouse.store';

@Options({
  components: {
    InventoryList,
    ProductList
  },
})
export default class Home extends Vue {
  get isStoreEmpty() {
    return store.getters.products.length === 0
      && store.getters.inventoryItems.length === 0;
  }
}
