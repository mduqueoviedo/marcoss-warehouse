/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {
    WarehouseState,
} from '@/store/warehouse.constants';
import { getters } from '@/store/warehouse.store';

describe('Warehouse store', () => {
    describe('getters', () => {
        describe('inventoryItems', () => {
            const state = {
                products: [],
                inventoryItems: [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 },
                    { id: 3, name: 'Article 3', stock: 0 }
                ]
            } as any;

            it('retrieves list of inventory items', () => {
                const inventoryItems = getters.inventoryItems(state);
                expect(inventoryItems.length).toEqual(3);
            });

            it('shows articles attributes', () => {
                const inventoryItems = getters.inventoryItems(state);

                expect(inventoryItems[0]).toHaveProperty('name', 'Article 1');
                expect(inventoryItems[1]).toHaveProperty('id', 2);
                expect(inventoryItems[2]).toHaveProperty('stock', 0);
            });
        });
        describe('products', () => {
            const state: WarehouseState = {
                products: [
                    { name: 'My Product 1', containedArticles: [{ articleId: 1, amount: 1 }] },
                    { name: 'My Product 2', containedArticles: [{ articleId: 2, amount: 3 }] },
                ],
                inventoryItems: [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ]
            };

            const originalInventoryItemById = getters.inventoryItemById;

            // Getters called inside the tested getters don't work in tests and need to be mocked (and restored)
            beforeAll(() => {
                const inventoryItemById = jest.fn();
                inventoryItemById.mockImplementation((id: number) => state.inventoryItems.find((item) => item.id === id));
                getters.inventoryItemById = inventoryItemById;
            });

            afterAll(() => {
                getters.inventoryItemById = originalInventoryItemById;
            });

            it('retrieves list of products', () => {
                const products = getters.products(state, getters as any);
                expect(products.length).toEqual(2);
            });

            it('shows amount of products available according to inventory', () => {
                const products = getters.products(state, getters as any);
                const product1 = products.find((product) => product.name === 'My Product 1');
                const product2 = products.find((product) => product.name === 'My Product 2');

                expect(product1).toHaveProperty('availableAmount', 3);
                expect(product2).toHaveProperty('availableAmount', 2);
            });

            it('appends articles attributes', () => {
                const products = getters.products(state, getters as any);
                const product1 = products.find((product) => product.name === 'My Product 1');

                expect(product1).toHaveProperty('containedArticles', [{ articleId: 1, amount: 1, name: 'Article 1' }]);
            });
        });
        describe('isProductAvailable', () => {
            const state: WarehouseState = {
                products: [
                    { name: 'My Product 1', containedArticles: [{ articleId: 1, amount: 1 }] },
                    { name: 'My Product 2', containedArticles: [{ articleId: 2, amount: 10 }] },
                ],
                inventoryItems: [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ]
            };

            const originalInventoryItemById = getters.inventoryItemById;
            const originalProductByName = getters.productByName;

            beforeAll(() => {
                const productByName = jest.fn();
                const inventoryItemById = jest.fn();

                productByName.mockImplementation((name: string) => state.products.filter((product) => product.name === name));
                getters.productByName = productByName;

                inventoryItemById.mockImplementationOnce((id: number) => state.inventoryItems.find((item) => item.id === id));
                getters.inventoryItemById = inventoryItemById;
            });

            afterAll(() => {
                getters.inventoryItemById = originalInventoryItemById;
                getters.productByName = originalProductByName;
            })

            it('tells whether a product has enough articles stock or not', () => {
                expect(getters.isProductAvailable(state, getters as any)('My Product 1')).toBe(true);
                expect(getters.isProductAvailable(state, getters as any)('My Product 2')).toBe(false);
            });
        });
        describe('inventoryItemByName', () => {
            const state: WarehouseState = {
                products: [],
                inventoryItems: [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ]
            };

            it('finds inventory items by their name', () => {
                const inventoryItems = [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ];
                // @ts-ignore
                expect(getters.inventoryItemByName(state, { inventoryItems })('Article 1')).toHaveProperty('stock', 3);
                // @ts-ignore
                expect(getters.inventoryItemByName(state, { inventoryItems })('Article 99')).toBeUndefined();
            })
        });
        describe('inventoryItemById', () => {
            const state: WarehouseState = {
                products: [],
                inventoryItems: [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ]
            };

            it('finds inventory items by their id', () => {
                const inventoryItems = [
                    { id: 1, name: 'Article 1', stock: 3 },
                    { id: 2, name: 'Article 2', stock: 7 }
                ]

                // @ts-ignore
                expect(getters.inventoryItemById(state, { inventoryItems })(1)).toHaveProperty('stock', 3);
                // @ts-ignore
                expect(getters.inventoryItemById(state, { inventoryItems })(42)).toBeUndefined();
            })
        });
        describe('productByName', () => {
            const state: WarehouseState = {
                products: [
                    { name: 'My Product 1', containedArticles: [{ articleId: 1, amount: 1 }] },
                    { name: 'My Product 2', containedArticles: [{ articleId: 2, amount: 10 }] },
                ],
                inventoryItems: []
            };

            it('finds products by their name', () => {
                const products = [
                    { name: 'My Product 1', containedArticles: [{ articleId: 1, amount: 1 }] },
                    { name: 'My Product 2', containedArticles: [{ articleId: 2, amount: 10 }] },
                ];

                // @ts-ignore
                expect(getters.productByName(state, { products })('My Product 1')[0]).toHaveProperty('name', 'My Product 1');
                // @ts-ignore
                expect(getters.productByName(state, { products })('Errol')).toBeUndefined();
            });

            it('finds products by starting name', () => {
                const products = [
                    { name: 'My Product 1', containedArticles: [{ articleId: 1, amount: 1 }] },
                    { name: 'My Product 2', containedArticles: [{ articleId: 2, amount: 10 }] },
                ];

                // @ts-ignore
                const searchResult = getters.productByName(state, { products })('My Product');
                expect(searchResult?.length).toEqual(2);
                expect(searchResult?.[1]).toHaveProperty('name', 'My Product 2');
            });
        });
    });
});