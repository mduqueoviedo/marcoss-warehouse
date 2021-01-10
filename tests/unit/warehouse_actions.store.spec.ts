/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {
    ADJUST_INVENTORY_ITEM,
    FileInventoryItem,
    FileProduct,
    SAVE_INVENTORY_ITEMS,
    SAVE_PRODUCT_DEFINITIONS,
    WarehouseState,
    WIPE_STORE
} from '@/store/warehouse.constants';
import { actions, getters } from '@/store/warehouse.store';

describe('Warehouse store', () => {
    describe('actions', () => {
        describe('saveInventoryItems', () => {
            const commit = jest.fn() as any;

            it('saves the inventory items from the received file contents', async () => {
                const state: WarehouseState = {
                    products: [],
                    inventoryItems: []
                };

                const itemsToSave: FileInventoryItem[] = [{ art_id: 1, name: 'my_article', stock: 1 }];

                // @ts-ignore
                await actions.saveInventoryItems({ commit, state }, { items: itemsToSave, overrideExisting: true })
                expect(commit).toHaveBeenCalledWith(SAVE_INVENTORY_ITEMS, { inventoryItems: itemsToSave, override: true });
            });

            it('only sends non existing items to the mutation when override is false', async () => {
                const state: WarehouseState = {
                    products: [],
                    inventoryItems: [{
                        id: 1, name: 'My article 1', stock: 1
                    }]
                };

                const itemsToSave: FileInventoryItem[] = [
                    { art_id: 1, name: 'my_article 1', stock: 1 },
                    { art_id: 2, name: 'my_article 2', stock: 4 },
                ];

                const expectedItems: FileInventoryItem[] = [
                    { art_id: 2, name: 'my_article 2', stock: 4 },
                ];

                // @ts-ignore
                await actions.saveInventoryItems({ commit, state }, { items: itemsToSave, overrideExisting: false })
                expect(commit).toHaveBeenCalledWith(SAVE_INVENTORY_ITEMS, { inventoryItems: expectedItems, override: false });
            });
        });
        describe('saveProducts', () => {
            const commit = jest.fn() as any;

            it('saves the products from the received file contents', async () => {
                const state: WarehouseState = {
                    products: [],
                    inventoryItems: []
                };

                const itemsToSave: FileProduct[] = [
                    { name: 'My Product', contain_articles: [{ art_id: 1, amount_of: 1 }] }
                ];

                // @ts-ignore
                await actions.saveProducts({ commit, state }, { items: itemsToSave, overrideExisting: true })
                expect(commit).toHaveBeenCalledWith(SAVE_PRODUCT_DEFINITIONS, { products: itemsToSave, override: true });
            });

            it('only sends non existing products to the mutation when override is false', async () => {
                const state: WarehouseState = {
                    products: [{
                        name: 'my_product 1', containedArticles: []
                    }],
                    inventoryItems: []
                };

                const itemsToSave: FileProduct[] = [
                    { name: 'my_product 1', contain_articles: [] },
                    { name: 'my_product 2', contain_articles: [] },
                ];

                const expectedItems: FileProduct[] = [
                    { name: 'my_product 2', contain_articles: [] },
                ];

                // @ts-ignore
                await actions.saveProducts({ commit, state }, { items: itemsToSave, overrideExisting: false });
                expect(commit).toHaveBeenCalledWith(SAVE_PRODUCT_DEFINITIONS, { products: expectedItems, override: false });
            });
        });
        describe('sellProduct', () => {
            const commit = jest.fn() as any;
            const originalProductByName = getters.productByName;

            beforeAll(() => {
                const productByName = jest.fn();

                productByName.mockImplementation(() => ([{
                    name: 'my_product 1', containedArticles: [
                        { articleId: 1, amount: 1 },
                        { articleId: 2, amount: 3 },
                        { articleId: 3, amount: 6 },
                    ]
                }]));
                getters.productByName = productByName;
            });

            afterAll(() => {
                getters.productByName = originalProductByName;
            })

            it('adjusts inventory according the sold product', async () => {
                // @ts-ignore
                await actions.sellProduct({ commit, getters }, { productName: 'my_product 1' });
                expect(commit).toHaveBeenNthCalledWith(1, ADJUST_INVENTORY_ITEM, { inventoryItemId: 1, amount: -1 });
                expect(commit).toHaveBeenNthCalledWith(2, ADJUST_INVENTORY_ITEM, { inventoryItemId: 2, amount: -3 });
                expect(commit).toHaveBeenNthCalledWith(3, ADJUST_INVENTORY_ITEM, { inventoryItemId: 3, amount: -6 });
            })
        });
        describe('wipeStore', () => {
            const commit = jest.fn() as any;

            it('clears the whole store', async () => {
                // @ts-ignore
                await actions.wipeStore({ commit });
                expect(commit).toHaveBeenCalledWith(WIPE_STORE);
            })
        });
    });
});