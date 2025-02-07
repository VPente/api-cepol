import { UpdateArticleImageDto } from "./UpdateArticleImageDto";

export class UpdateArticleDto {
    id: number;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    professionalId: number | null;
    image: UpdateArticleImageDto[] | null;

    constructor(id: number, title: string, description: string, bodyText: string, secondText: string, professionalId: number | null, image: UpdateArticleImageDto[] | null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.professionalId = professionalId;
        this.image = image;
    }
}