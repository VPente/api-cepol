import { ResearchImage } from "./ResearchImage";

export class Research {
    constructor(
        public readonly id: number | null,
        public title: string,
        public description: string,
        public bodyText: string,
        public secondText: string,
        public createdAt: Date,
        public updatedAt: Date,
        public image: ResearchImage[] | null,
    ) {
        this.validate();
    }

    private validate() {
        if (!this.title || this.title.trim().length === 0) {
            throw new Error("O título é obrigatório.");
        }
    }

    public updateDescription(newDescription: string) {
        this.description = newDescription;
    }

    public updateTitle(newTitle: string) {
        if (!newTitle || newTitle.trim().length === 0) {
            throw new Error("O novo título é obrigatório.");
        }
        this.title = newTitle;
    }
}