export class Professional {
    constructor(
        public readonly id: number | null,
        public name: string,
        public role: string,
        public bio: string | null,
        public imageUrl: string | null,
        public createdAt: Date,
        public hierarchy: number
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("O nome é obrigatório.");
        }
        if (!this.role || this.role.trim().length === 0) {
            throw new Error("O cargo é obrigatório.");
        }
        if (this.imageUrl && !this.imageUrl.startsWith("https://")) {
            throw new Error(" e começar com https://.");
        }
    }

    public updateBio(newBio: string | null) {
        this.bio = newBio;
    }

    public updateImageUrl(newImageUrl: string | null) {
        if (newImageUrl && !newImageUrl.startsWith("https://")) {
            throw new Error("A nova URL da imagem deve ser válida e começar com https://.");
        }
        this.imageUrl = newImageUrl;
    }
}