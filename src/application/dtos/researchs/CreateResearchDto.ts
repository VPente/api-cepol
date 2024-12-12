import { CreateResearchImageDto } from "./CreateResearchImageDto";

export class CreateResearchDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    createdAt: Date;
    updatedAt: Date;
    images: CreateResearchImageDto[] | null;

    constructor(title: string, description: string, bodyText: string, secondText: string, createdAt: Date, updatedAt: Date, images: CreateResearchImageDto[] | null) {
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.images = images;
    }
}