import { ActionContext, createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import {
    FileInventoryItem,
    FileProduct,
    InventoryItem,
    Product,
    WarehouseGetters,
    WarehouseState,
    SAVE_INVENTORY_ITEMS,
    SAVE_PRODUCT_DEFINITIONS,
    WIPE_STORE,
    ADJUST_INVENTORY_ITEM,
} from "./warehouse.constants";

const vuexLocal = new VuexPersistence<WarehouseState>({
    storage: localStorage
})

const state: WarehouseState = {
    products: [],
    inventoryItems: [],
};

export const actions = {
    saveInventoryItems: (
        { commit, state }: ActionContext<WarehouseState, WarehouseState>,
        payload: {
            items: FileInventoryItem[];
            overrideExisting: boolean;
        }
    ) => {
        if (payload.overrideExisting || state.inventoryItems?.length === 0) {
            commit(SAVE_INVENTORY_ITEMS, { inventoryItems: payload.items, override: true });
        } else {
            const existingInventoryItems = state.inventoryItems?.map((item) => item.id);
            const filteredItems = payload.items
                .filter((item) => !existingInventoryItems?.includes(Number(item.art_id)));

            commit(SAVE_INVENTORY_ITEMS, { inventoryItems: filteredItems, override: false });
        }
    },

    saveProducts: (
        { commit, state }: ActionContext<WarehouseState, WarehouseState>,
        payload: {
            items: FileProduct[];
            overrideExisting: boolean;
        }
    ) => {
        if (payload.overrideExisting || state.products?.length === 0) {
            commit(SAVE_PRODUCT_DEFINITIONS, { products: payload.items, override: true });
        } else {
            const existingProductDefinitions = state.products?.map((product) => product.name);
            const filteredProducts = payload.items
                .filter((product) => !existingProductDefinitions?.includes(product.name));

            commit(SAVE_PRODUCT_DEFINITIONS, { products: filteredProducts, override: false });
        }
    },

    sellProduct: (
        { commit, getters }: ActionContext<WarehouseState, WarehouseState>,
        productName: string
    ) => {
        const product: Product[] = getters.productByName(productName);

        if (!product || !getters.isProductAvailable(productName)) {
            return;
        }

        product[0].containedArticles.forEach((article) => {
            commit(ADJUST_INVENTORY_ITEM, {
                inventoryItemId: article.articleId,
                amount: article.amount * -1
            });
        });
    },

    wipeStore: ({ commit }: ActionContext<WarehouseState, WarehouseState>) => {
        commit(WIPE_STORE);
    }
};

export const getters = {
    inventoryItems: (state: WarehouseState) => state.inventoryItems,

    products: (state: WarehouseState, getters: WarehouseGetters) =>
        state.products?.map((product) => {
            const availableAmount = Math.min(...product.containedArticles.map((article) =>
                Math.floor((getters.inventoryItemById(article.articleId)?.stock || 0) / article.amount)
            ));

            return {
                name: product.name,
                price: product.price,
                availableAmount,
                containedArticles: product.containedArticles
                    .filter((containedArticle) => getters.inventoryItemById(containedArticle.articleId) !== undefined)
                    .map((containedArticle) => ({
                        ...containedArticle,
                        name: getters.inventoryItemById(containedArticle.articleId)?.name
                    }))
            };
        }),

    isProductAvailable: (_: WarehouseState, getters: WarehouseGetters) =>
        (productName: string, amount = 1) => {
            const product: Product[] | undefined = getters.productByName(productName);

            if (!product) {
                return;
            }

            return product[0].containedArticles.every((article) =>
                article.amount <= amount * (getters.inventoryItemById(article.articleId)?.stock || 0)
            );
        },

    inventoryItemByName: (state: WarehouseState) =>
        (name: string) =>
            state.inventoryItems?.some((inventoryItem) => inventoryItem.name === name)
                ? state.inventoryItems?.filter((inventoryItem) => inventoryItem.name === name)[0]
                : undefined,

    inventoryItemById: (state: WarehouseState) =>
        (id: number) =>
            state.inventoryItems?.some((inventoryItem) => inventoryItem.id === id)
                ? state.inventoryItems?.filter((inventoryItem) => inventoryItem.id === id)[0]
                : undefined,

    productByName: (state: WarehouseState) =>
        (name: string) =>
            state.products?.some((product) => product.name.startsWith(name))
                ? state.products?.filter((product) => product.name.startsWith(name))
                : undefined
};

export const mutations = {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,

    [SAVE_INVENTORY_ITEMS](state: WarehouseState, payload: {
        inventoryItems: FileInventoryItem[];
        override?: boolean;
    }) {
        const mappedInventoryItems: InventoryItem[] = payload.inventoryItems.map((inventoryItem) => ({
            id: Number(inventoryItem.art_id),
            name: inventoryItem.name,
            stock: Number(inventoryItem.stock)
        }));

        if (payload.override) {
            state.inventoryItems = mappedInventoryItems;
        } else {
            state.inventoryItems?.push(...mappedInventoryItems);
        }
    },

    [SAVE_PRODUCT_DEFINITIONS](state: WarehouseState, payload: {
        products: FileProduct[];
        override?: boolean;
    }) {
        const mappedProducts: Product[] = payload.products.map((product) => ({
            name: product.name,
            price: (Math.random() * (500 - 10) + 10).toFixed(2), // Random price between 10 and 500
            containedArticles: product.contain_articles.map((containedArticle) => ({
                articleId: Number(containedArticle.art_id),
                amount: Number(containedArticle.amount_of)
            }))
        }));

        if (payload.override) {
            state.products = mappedProducts;
        } else {
            state.products?.push(...mappedProducts);
        }
    },

    [ADJUST_INVENTORY_ITEM](state: WarehouseState, payload: {
        inventoryItemId: number;
        amount: number;
    }) {
        const inventoryItemIndex = state.inventoryItems.findIndex(
            (item) => item.id === payload.inventoryItemId
        );

        if (inventoryItemIndex !== -1) {
            const updatedInventoryItem = state.inventoryItems[inventoryItemIndex];
            updatedInventoryItem.stock += payload.amount;
        }
    },

    [WIPE_STORE](state: WarehouseState) {
        state.products = [];
        state.inventoryItems = [];
    }
};

export const store = createStore({
    state,
    actions,
    getters,
    mutations,
    plugins: [vuexLocal.plugin]
});
