export class CreateProfessionalDto {
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;

    constructor(name: string, role: string, bio: string | null, imageUrl: string | null) {
        this.name = name;
        this.role = role;
        this.bio = bio;
        this.imageUrl = imageUrl;
    }
}