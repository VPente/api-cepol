import { UpdateArticleDto } from "application/dtos/articles/UpdateArticleDto";
import { Article } from "domain/entities/articles/Article";
import { IArticleRepository } from "domain/interfaces/articles/IArticleRepository";

export class UpdateArticleUseCase {
    constructor(private articleRepository: IArticleRepository) { }

    async execute(dto: UpdateArticleDto): Promise<Article> {

        return this.articleRepository.update(dto);
    }
}