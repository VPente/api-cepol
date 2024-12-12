export class CreateArticleDto {
    title: string;
    content: string;
    fileUrl?: string;

    constructor(title: string, content: string, fileUrl?: string) {
        this.title = title;
        this.content = content;
        this.fileUrl = fileUrl;
    }
}