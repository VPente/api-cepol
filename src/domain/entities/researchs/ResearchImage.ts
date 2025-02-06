export class ResearchImage {
    constructor(
        public readonly id: number | null,
        public readonly researchId: number | null,
        public url: string | null,
        public title: string | null,
        public description: string | null,
    ) {

    }

}