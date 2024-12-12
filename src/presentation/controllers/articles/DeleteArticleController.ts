import { DeleteArticleUseCase } from 'application/use-cases/articles/DeleteArticleUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ArticleRepository } from 'infrastructure/database/repositories/articles/ArticleRepository';
import { z } from 'zod';

const articleRepository = new ArticleRepository();

export class DeleteArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Delete an existing article',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' }),
            }),
        },
        responses: {
            '200': {
                description: 'Article deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            '404': {
                description: 'Article not found',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    };

    async handle(c) {
        const data = await this.getValidatedData<typeof this.schema>();

        const { id } = data.params;

        try {
            const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

            await deleteArticleUseCase.execute(id);

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Article deletion failed',
            };
        }
    }
}