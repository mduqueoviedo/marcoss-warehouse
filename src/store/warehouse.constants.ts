export interface WarehouseState {
    products: Product[];
    inventoryItems: InventoryItem[];
}

export interface FileProduct {
    name: string;
    contain_articles: FileContainedArticle[];
}

export interface Product {
    name: string;
    price?: string;
    containedArticles: ContainedArticle[];
}

export interface FileContainedArticle {
    art_id: number;
    amount_of: number;
}

export interface ContainedArticle {
    articleId: number;
    amount: number;
}

export interface FileInventoryItem {
    art_id: number;
    name: string;
    stock: number;
}

export interface InventoryItem {
    id: number;
    name: string;
    stock: number;
}

export interface ProductWithAvailability extends Product {
    availableAmount: number;
}

export interface WarehouseGetters {
    inventoryItems: (state: WarehouseState) => InventoryItem[];
    products: (state: WarehouseState) => ProductWithAvailability[];
    isProductAvailable: (state: WarehouseState, getters: WarehouseGetters) => boolean;
    inventoryItemByName: (inventoryItemName: string) => InventoryItem | undefined;
    inventoryItemById: (inventoryItemId: number) => InventoryItem | undefined;
    productByName: (productName: string) => Product[] | undefined;
}

export const SAVE_INVENTORY_ITEMS = 'save_inventory_items';
export const SAVE_PRODUCT_DEFINITIONS = 'save_product_definitions';
export const ADJUST_INVENTORY_ITEM = 'adjust_inventory_item';
export const WIPE_STORE = 'wipe_store';
