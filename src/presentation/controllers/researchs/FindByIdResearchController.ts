import { FindByIdResearchUseCase } from 'application/use-cases/researchs/FindByIdResearchUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ResearchRepository } from 'infrastructure/database/repositories/researchs/ResearchRepository';
import { z } from 'zod';

const researchRepository = new ResearchRepository();

export class FindByIdResearchController extends OpenAPIRoute {
    schema = {
        tags: ['Researchs'],
        summary: 'Retrieve a research by ID',
        parameters: [
            {
                name: 'id',
                in: 'path' as const,
                required: true,
                schema: {
                    type: 'integer' as const,
                },
                description: 'ID of the research to retrieve',
            },
        ],
        responses: {
            '200': {
                description: 'Research retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                title: z.string(),
                                description: z.string(),
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
                            }).nullable(),
                        }),
                    },
                },
            },
            '400': {
                description: 'Failed to retrieve research',
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

    async handle(req: { params: { id: number } }) {
        try {
            const { id } = req.params;
            const findByIdResearchUseCase = new FindByIdResearchUseCase(researchRepository);
            const research = await findByIdResearchUseCase.execute(id);

            if (!research) {
                return {
                    success: false,
                    message: 'Research not found',
                };
            }

            return {
                success: true,
                result: {
                    id: research.id,
                    title: research.title,
                    description: research.description,
                    bodyText: research.bodyText,
                    secondText: research.secondText,
                    createdAt: research.createdAt.toISOString(),
                    updatedAt: research.updatedAt.toISOString(),
                    images: research.image ? research.image.map(image => ({
                        id: image.id,
                        researchId: image.researchId,
                        url: image.url,
                        title: image.title,
                        description: image.description,
                    })) : null,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve research',
            };
        }
    }
}