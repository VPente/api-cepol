import { UpdateArticleDto } from "application/dtos/articles/UpdateArticleDto";
import { Article } from "domain/entities/articles/Article";
import { IArticleRepository } from "domain/interfaces/articles/IArticleRepository";

export class UpdateArticleUseCase {
    constructor(private articleRepository: IArticleRepository) { }

    async execute(dto: UpdateArticleDto): Promise<Article> {
        const article = await this.articleRepository.findById(dto.id);
        if (!article) {
            throw new Error('Article not found');
        }

        article.title = dto.title;
        article.content = dto.content;
        article.fileUrl = dto.fileUrl;
        article.updatedAt = new Date();

        return this.articleRepository.update(article);
    }
}