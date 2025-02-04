import { FindByIdProfessionalUseCase } from 'application/use-cases/professionals/FindByIdProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ProfessionalRepository } from 'infrastructure/database/repositories/professionals/ProfessionalRepository';
import { z } from 'zod';

const professionalRepository = new ProfessionalRepository();

export class FindByIdProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Retrieve a professional by ID',
        parameters: [
            {
                name: 'id',
                in: 'path' as const,
                required: true,
                schema: {
                    type: 'integer' as const,
                },
                description: 'ID of the professional to retrieve',
            },
        ],
        responses: {
            '200': {
                description: 'Professional retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                id: z.number(),
                                name: z.string(),
                                role: z.string(),
                                bio: z.string().nullable(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                hierarchy: z.number().nullable(),
                            }).nullable(),
                        }),
                    },
                },
            },
            '400': {
                description: 'Failed to retrieve professional',
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
            const findByIdProfessionalUseCase = new FindByIdProfessionalUseCase(professionalRepository);
            const professional = await findByIdProfessionalUseCase.execute(id);

            if (!professional) {
                return {
                    success: false,
                    message: 'Professional not found',
                };
            }

            return {
                success: true,
                result: {
                    id: professional.id,
                    name: professional.name,
                    role: professional.role,
                    bio: professional.bio,
                    imageUrl: professional.imageUrl,
                    createdAt: professional.createdAt.toISOString(),
                    hierarchy: professional.hierarchy,
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve professional',
            };
        }
    }
}