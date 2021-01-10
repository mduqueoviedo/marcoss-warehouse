import { store } from '@/store/warehouse.store';
import { Vue } from 'vue-class-component';

export default class WipeData extends Vue {
    showConfirmation = false;
    showDeletionConfirm = false;
    
    wipeStore() {
        this.showConfirmation = true;
        this.showDeletionConfirm = false;
    }

    confirmDeletion() {
        store.dispatch('wipeStore');
        this.showConfirmation = false;
        this.showDeletionConfirm = true;

        setTimeout(() => this.showDeletionConfirm = false, 3000);
    }

    cancelDeletion() {
        this.showConfirmation = false;
    }
}
