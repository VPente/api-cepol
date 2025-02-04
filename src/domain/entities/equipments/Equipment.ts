export class Equipment {
    constructor(
        public readonly id: number | null,
        public name: string,
        public description: string | null,
        public imageUrl: string | null,
        public createdAt: Date,
        public type: string | null
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("O nome é obrigatório.");
        }
        if (this.imageUrl && !this.imageUrl.startsWith("https://")) {
            throw new Error("A URL da imagem deve ser válida e começar com https://.");
        }
    }

    public updateDescription(newDescription: string | null) {
        this.description = newDescription;
    }

    public updateImageUrl(newImageUrl: string | null) {
        if (newImageUrl && !newImageUrl.startsWith("https://")) {
            throw new Error("A nova URL da imagem deve ser válida e começar com https://.");
        }
        this.imageUrl = newImageUrl;
    }
}