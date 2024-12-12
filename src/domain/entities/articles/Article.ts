export class Article {
    constructor(
        public readonly id: number | null,
        public title: string,
        public content: string,
        public fileUrl: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.title || this.title.trim().length < 5) {
            throw new Error("O título deve ter pelo menos 5 caracteres.");
        }
        // if (!this.content || this.content.trim().length < 20) {
        //     throw new Error("O conteúdo deve ter pelo menos 20 caracteres.");
        // }    
        if (this.fileUrl && !this.fileUrl.startsWith("https://")) {
            throw new Error("A URL do arquivo deve ser válida e começar com https://.");
        }
    }

    public updateContent(newContent: string) {
        if (newContent.trim().length < 20) {
            throw new Error("O novo conteúdo deve ter pelo menos 20 caracteres.");
        }
        this.content = newContent;
        this.updatedAt = new Date();
    }
}