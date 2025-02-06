import { UpdateArticleImageDto } from "./UpdateArticleImageDto";

export class UpdateArticleDto {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    image: UpdateArticleImageDto[] | null;

    constructor(id: number, title: string, description: string, bodyText: string, secondText: string, createdAt: Date, updatedAt: Date, image: UpdateArticleImageDto[] | null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.image = image;
    }
}