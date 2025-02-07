import { Professional } from "../professionals/Professional";
import { ArticleImage } from "./ArticleImage";

export class Article {
    constructor(
        public readonly id: number | null,
        public title: string,
        public description: string,
        public bodyText: string,
        public secondText: string,
        public createdAt: Date,
        public updatedAt: Date,
        public professionalId: number | null,
        public images: ArticleImage[] | null,
        public professional: Professional | null,
    ) {
    }

}