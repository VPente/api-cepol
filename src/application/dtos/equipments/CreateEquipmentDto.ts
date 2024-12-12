export class CreateEquipmentDto {
    name: string;
    description: string | null;
    imageUrl: string | null;

    constructor(name: string, description: string, imageUrl?: string) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}