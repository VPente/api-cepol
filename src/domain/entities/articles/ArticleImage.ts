export class ArticleImage {
    constructor(
        public readonly id: number | null,
        public readonly articleId: number | null,
        public url: string | null,
        public title: string | null,
        public description: string | null,
    ) {

    }

}