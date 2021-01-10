/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { JsonFileType, jsonLoader } from '@/services/jsonLoader';
import { store } from '@/store/warehouse.store';
import jsonInventory from './aux/inventory.json';
import jsonProducts from './aux/products.json';

describe('jsonLoader', () => {
    describe('init()', () => {
        afterEach(() => {
            jsonLoader.clear();
        });

        it('initializes json loader with json data', () => {
            jsonLoader.init(JSON.stringify(jsonInventory));

            expect(jsonLoader.typeOfJsonContent).not.toEqual(JsonFileType.Unknown);
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Inventory);
        });

        it('returns console error when file content is not JSON', () => {
            const spy = jest.spyOn(console, 'error').mockImplementation();
            jsonLoader.init("This looks bad");

            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Unknown);
            expect(console.error).toHaveBeenCalled();

            spy.mockRestore();
        });
    });

    describe('typeOfJsonContent()', () => {
        afterEach(() => {
            jsonLoader.clear();
        });

        it('returns type of json file', () => {
            jsonLoader.init(JSON.stringify(jsonInventory));
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Inventory);

            jsonLoader.clear();

            jsonLoader.init(JSON.stringify(jsonProducts));
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Products);
        });

        it('returns unknown when not valid file', () => {
            // Redundancy to prevent console output on test results
            const spy = jest.spyOn(console, 'error').mockImplementation();

            jsonLoader.init("This looks bad again");
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Unknown);

            spy.mockRestore();
        });
    });

    describe('saveIntoStore()', () => {
        let spy: jest.SpyInstance;

        beforeAll(() => {
            spy = jest.spyOn(store, 'dispatch').mockImplementation();
        });

        afterAll(() => {
            spy.mockRestore();
        })

        it('stores loaded information into vuex store', () => {
            jsonLoader.init(JSON.stringify(jsonInventory));
            jsonLoader.saveIntoStore(true);

            expect(store.dispatch).toHaveBeenCalledWith(
                "saveInventoryItems",
                {
                    overrideExisting: true,
                    items: jsonInventory.inventory
                }
            );
        });
    });

    describe('preloadedFileInfo()', () => {
        it('returns information regarding the type of file preloaded', () => {
            jsonLoader.init(JSON.stringify(jsonInventory));

            expect(jsonLoader.preloadedFileInfo).toMatchObject({ type: JsonFileType.Inventory, itemsAmount: 4 });
        });
    });

    describe('clear()', () => {
        it('deletes json loader content', () => {
            jsonLoader.init(JSON.stringify(jsonInventory));
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Inventory);

            jsonLoader.clear();
            expect(jsonLoader.typeOfJsonContent).toEqual(JsonFileType.Unknown);
        });
    });
});