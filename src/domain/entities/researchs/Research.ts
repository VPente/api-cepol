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

    }
}