import { store } from "@/store/warehouse.store";

export enum JsonFileType {
    Inventory = 'inventory',
    Products = 'products',
    Unknown = 'unknown',
}

class JsonLoader {
    private content: Record<string, string> = {};

    init(jsonText: string) {
        try {
            this.content = JSON.parse(jsonText);
        } catch (e) {
            console.error("The provided file does not respect the JSON format: ", e);
        }
    }

    get typeOfJsonContent(): JsonFileType {
        if (this.isContentEmpty(this.content)) {
            return JsonFileType.Unknown;
        }

        switch (Object.keys(this.content)[0]) {
            case 'products':
                return JsonFileType.Products;
            case 'inventory':
                return JsonFileType.Inventory;
            default:
                return JsonFileType.Unknown;
        }
    }

    saveIntoStore(overrideExisting = false) {
        if (this.typeOfJsonContent === JsonFileType.Unknown) {
            return;
        }

        store.dispatch(this.typeOfJsonContent === JsonFileType.Inventory
            ? 'saveInventoryItems'
            : 'saveProducts',
            {
                items: this.content[
                    this.typeOfJsonContent === JsonFileType.Inventory
                        ? 'inventory'
                        : 'products'
                ],
                overrideExisting
            }
        )
    }

    get preloadedFileInfo() {
        return {
            type: this.typeOfJsonContent,
            itemsAmount: this.content[
                this.typeOfJsonContent === JsonFileType.Inventory
                    ? 'inventory'
                    : 'products'
            ].length
        }
    }

    clear() {
        this.content = {};
    }

    private isContentEmpty = (content: Record<string, string>) =>
        Object.keys(content).length === 0;
}

export const jsonLoader = new JsonLoader();
