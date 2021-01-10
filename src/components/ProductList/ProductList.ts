import { store } from '@/store/warehouse.store';
import { Vue } from 'vue-class-component';

export default class ProductList extends Vue {
    get productsList() {
        return store.getters.products;
    }

    sellProduct(productName: string) {
        store.dispatch('sellProduct', productName);
    }
}
