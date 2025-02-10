
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
                                description: z.string().nullable(),
                                bodyText: z.string(),
                                secondText: z.string(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                                images: z.array(z.object({
                                    id: z.number().nullable(),
                                    researchId: z.number().nullable(),
                                    url: z.string().nullable(),
                                    title: z.string().nullable(),
                                    description: z.string().nullable(),
                                })).nullable(),
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
                    description: article.description,
                    bodyText: article.bodyText,
                    secondText: article.secondText,
                    createdAt: article.createdAt.toISOString(),
                    updatedAt: article.updatedAt.toISOString(),
                    images: article.images ? article.images.map(image => ({
                        id: image.id,
                        researchId: image.articleId,
                        url: image.url,
                        title: image.title,
                        description: image.description,
                    })) : null,
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