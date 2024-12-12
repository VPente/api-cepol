import { IArticleRepository } from 'domain/interfaces/articles/IArticleRepository';

export class DeleteArticleUseCase {
    constructor(private articleRepository: IArticleRepository) { }

    async execute(id: number): Promise<void> {
        const article = await this.articleRepository.findById(id);
        if (!article) {
            throw new Error('Article not found');
        }

        await this.articleRepository.delete(id);
    }
}











