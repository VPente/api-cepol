
import { FindAllArticlesUseCase } from 'application/use-cases/articles/FindAllArticleUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ArticleRepository } from 'infrastructure/database/repositories/articles/ArticleRepository';
import { z } from 'zod';

const articleRepository = new ArticleRepository();

export class FindAllArticleController extends OpenAPIRoute {
    schema = {
        tags: ['Articles'],
        summary: 'Retrieve all articles',
        responses: {
            '200': {
                description: 'List of articles retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.array(z.object({
                                id: z.number(),
                                title: z.string(),
                                content: z.string(),
                                fileUrl: z.string().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            })),
                        }),
                    },
                },
            },
            '400': {
                description: 'Failed to retrieve articles',
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

    async handle() {
        try {
            const findAllArticlesUseCase = new FindAllArticlesUseCase(articleRepository);
            const articles = await findAllArticlesUseCase.execute();

            return {
                success: true,
                result: articles.map(article => ({
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    fileUrl: article.fileUrl,
                    createdAt: article.createdAt.toISOString(),
                    updatedAt: article.updatedAt.toISOString(),
                })),
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve articles',
            };
        }
    }
}