import { JsonFileType, jsonLoader } from '@/services/jsonLoader';
import { Vue } from 'vue-class-component';

export default class LoadItems extends Vue {
    private reader = new FileReader();
    private jsonLoader = jsonLoader;

    showFileLoadError = false;
    showUploadConfirmation = false;

    isFileLoaded = false;

    mounted() {
        this.reader.addEventListener("load", (e) => {
            const fileContent = e.target?.result;
            this.showFileLoadError = false;
            this.showUploadConfirmation = false

            if (fileContent) {
                this.jsonLoader.init(fileContent as string);
                this.isFileLoaded = true;
            }

            if (this.jsonLoader.typeOfJsonContent === JsonFileType.Unknown) {
                this.clearFile();
                this.showFileLoadError = true;
                setTimeout(() => this.showFileLoadError = false, 5000);
            }
        });
    }

    onFileChange(e: { target: HTMLInputElement; dataTransfer: DataTransfer }) {
        const files = e.target.files;

        if (!files || !files.length) {
            return;
        } else {
            this.reader.readAsText(files[0]);
        }
    }

    confirmFileLoad(override: boolean) {
        this.jsonLoader.saveIntoStore(override);
        this.clearFile();
        this.showUploadConfirmation = true;
    }

    clearFile() {
        (this.$refs as any).contentFile.value = '';
        this.isFileLoaded = false;
        this.jsonLoader.clear();
    }

    get fileContents() {
        const info = this.jsonLoader.preloadedFileInfo;
        return `${info.type} file detected. ${info.itemsAmount} elements will be added.`;
    }
}
