import { CreateArticleImageDto } from "./CreateArticleImageDto";

export class CreateArticleDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    images: CreateArticleImageDto[] | null;

    constructor(
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        images: CreateArticleImageDto[] | null
    ) {
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.images = images;
    }
}