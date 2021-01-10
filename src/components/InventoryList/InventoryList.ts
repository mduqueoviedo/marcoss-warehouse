import { store } from '@/store/warehouse.store';
import { Vue } from 'vue-class-component';

export default class InventoryList extends Vue {
    get itemsList() {
        return store.getters.inventoryItems;
    }
}
