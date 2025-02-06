import { CreateResearchImageDto } from "./CreateResearchImageDto";

export class CreateResearchDto {
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    images: CreateResearchImageDto[] | null;

    constructor(
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        images: CreateResearchImageDto[] | null
    ) {
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.images = images;
    }
}