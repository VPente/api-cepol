import { CreateArticleImageDto } from "./CreateArticleImageDto";

export class CreateArticleDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    professionalId: number | null;
    images: CreateArticleImageDto[] | null;

    constructor(
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        professionalId: number | null,
        images: CreateArticleImageDto[] | null
    ) {
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        professionalId = professionalId;
        this.images = images;
    }
}