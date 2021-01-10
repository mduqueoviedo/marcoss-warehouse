/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {
    FileInventoryItem,
    FileProduct,
    WarehouseState,
} from '@/store/warehouse.constants';
import { mutations } from '@/store/warehouse.store';

describe('Warehouse store', () => {
    describe('mutations', () => {
        describe('SAVE_INVENTORY_ITEMS', () => {
            describe('override true', () => {
                it('saves inventory items removing anything previous', () => {
                    const state: WarehouseState = {
                        products: [],
                        inventoryItems: [
                            { id: 1, name: 'article1', stock: 10 },
                            { id: 2, name: 'article2', stock: 10 },
                            { id: 3, name: 'article3', stock: 10 }
                        ]
                    };

                    const newItems: FileInventoryItem[] = [
                        { art_id: 10, stock: 1, name: 'new article 1' },
                        { art_id: 11, stock: 1, name: 'new article 2' },
                        { art_id: 12, stock: 1, name: 'new article 3' },
                    ];

                    mutations.save_inventory_items(state, { inventoryItems: newItems, override: true });
                    expect(state.inventoryItems[0]).toMatchObject({ id: 10, stock: 1, name: 'new article 1' });
                    expect(state.inventoryItems[1]).toMatchObject({ id: 11, stock: 1, name: 'new article 2' });
                    expect(state.inventoryItems[2]).toMatchObject({ id: 12, stock: 1, name: 'new article 3' });
                });
            });

            describe('override false', () => {
                it('appends inventory items to the present ones', () => {
                    const state: WarehouseState = {
                        products: [],
                        inventoryItems: [
                            { id: 1, name: 'article1', stock: 10 },
                            { id: 2, name: 'article2', stock: 10 },
                            { id: 3, name: 'article3', stock: 10 }
                        ]
                    };

                    const newItems: FileInventoryItem[] = [
                        { art_id: 10, stock: 1, name: 'new article 1' },
                        { art_id: 11, stock: 1, name: 'new article 2' },
                        { art_id: 12, stock: 1, name: 'new article 3' },
                    ];

                    mutations.save_inventory_items(state, { inventoryItems: newItems, override: false });
                    expect(state.inventoryItems.length).toEqual(6);
                    expect(state.inventoryItems[0]).toMatchObject({ id: 1, stock: 10, name: 'article1' });
                    expect(state.inventoryItems[3]).toMatchObject({ id: 10, stock: 1, name: 'new article 1' });
                });
            });
        });
        describe('SAVE_PRODUCT_DEFINITIONS', () => {
            describe('override true', () => {
                it('saves products removing anything previous', () => {
                    const state: WarehouseState = {
                        products: [
                            { name: 'product 1', containedArticles: [] },
                            { name: 'product 2', containedArticles: [] },
                            { name: 'product 3', containedArticles: [] }
                        ],
                        inventoryItems: []
                    };

                    const newProducts: FileProduct[] = [
                        { name: 'new product 1', contain_articles: [] },
                        { name: 'new product 2', contain_articles: [{ art_id: 1, amount_of: 2 }] },
                        { name: 'new product 3', contain_articles: [] },
                    ];

                    mutations.save_product_definitions(state, { products: newProducts, override: true });
                    expect(state.products[0]).toMatchObject({ name: 'new product 1', containedArticles: [] });
                    expect(state.products[1]).toMatchObject({ name: 'new product 2', containedArticles: [{ articleId: 1, amount: 2 }] });
                    expect(state.products[2]).toMatchObject({ name: 'new product 3', containedArticles: [] });
                });
            });

            describe('override false', () => {
                it('appends new products to the present ones', () => {
                    const state: WarehouseState = {
                        products: [
                            { name: 'product 1', containedArticles: [] },
                            { name: 'product 2', containedArticles: [] },
                            { name: 'product 3', containedArticles: [] }
                        ],
                        inventoryItems: []
                    };

                    const newProducts: FileProduct[] = [
                        { name: 'new product 1', contain_articles: [] },
                        { name: 'new product 2', contain_articles: [{ art_id: 1, amount_of: 2 }] },
                        { name: 'new product 3', contain_articles: [] },
                    ];

                    mutations.save_product_definitions(state, { products: newProducts, override: false });
                    expect(state.products.length).toEqual(6);
                    expect(state.products[0]).toMatchObject({ name: 'product 1', containedArticles: [] });
                    expect(state.products[4]).toMatchObject({ name: 'new product 2', containedArticles: [{ articleId: 1, amount: 2 }] });
                });
            });
        });
        describe('ADJUST_INVENTORY_ITEM', () => {
            it('removes the corresponding amount of certain inventory item', () => {
                const state: WarehouseState = {
                    products: [],
                    inventoryItems: [
                        { id: 1, name: 'article1', stock: 10 },
                        { id: 2, name: 'article2', stock: 10 },
                        { id: 3, name: 'article3', stock: 10 }
                    ]
                };

                mutations.adjust_inventory_item(state, { inventoryItemId: 2, amount: -2 });
                expect(state.inventoryItems.find((item) => item.id === 2)?.stock).toEqual(8);
            });
        });
        describe('WIPE_STORE', () => {
            it('clears the products and inventory items from the store', () => {
                const state: WarehouseState = {
                    products: [
                        { name: 'product 1', containedArticles: [] },
                        { name: 'product 2', containedArticles: [] },
                        { name: 'product 3', containedArticles: [] }
                    ],
                    inventoryItems: [
                        { id: 1, name: 'article1', stock: 10 },
                        { id: 2, name: 'article2', stock: 10 },
                        { id: 3, name: 'article3', stock: 10 }
                    ]
                };

                mutations.wipe_store(state);
                expect(state.products.length).toEqual(0);
                expect(state.inventoryItems.length).toEqual(0);
            });
        });
    });
});