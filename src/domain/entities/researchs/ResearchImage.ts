export class ResearchImage {
    constructor(
        public readonly id: number | null,
        public readonly researchId: number | null,
        public url: string | null,
        public title: string | null,
        public description: string | null,
    ) {
        this.validate();
    }

    private validate() {
        if (this.url && !this.url.startsWith("https://")) {
            throw new Error("A URL do arquivo deve ser válida e começar com https://.");
        }
    }

    public updateFileUrl(newFileUrl: string | null) {
        if (newFileUrl && !newFileUrl.startsWith("https://")) {
            throw new Error("A nova URL do arquivo deve ser válida e começar com https://.");
        }
        this.url = newFileUrl;
    }
}