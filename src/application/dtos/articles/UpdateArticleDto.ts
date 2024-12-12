export class UpdateArticleDto {
    id: number;
    title: string;
    content: string;
    fileUrl?: string;

    constructor(id: number, title: string, content: string, fileUrl?: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.fileUrl = fileUrl;
    }
}