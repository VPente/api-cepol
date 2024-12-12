import { UpdateResearchImageDto } from "./UpdateResearchImageDto";

export class UpdateResearchDto {
    id: number | null;
    title: string;
    description: string;
    bodyText: string;
    secondText: string;
    images: UpdateResearchImageDto[] | null;

    constructor(
        id: number | null,
        title: string,
        description: string,
        bodyText: string,
        secondText: string,
        createdAt: Date,
        updatedAt: Date,
        images: UpdateResearchImageDto[] | null
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.bodyText = bodyText;
        this.secondText = secondText;
        this.images = images;
    }
}