import { FindAllProfessionalUseCase } from 'application/use-cases/professionals/FindAllProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ProfessionalRepository } from 'infrastructure/database/repositories/professionals/ProfessionalRepository';
import { z } from 'zod';

const professionalRepository = new ProfessionalRepository();

export class FindAllProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Retrieve all professionals',
        responses: {
            '200': {
                description: 'List of professionals retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                            result: z.array(z.object({
                                id: z.number(),
                                name: z.string(),
                                role: z.string(),
                                bio: z.string().nullable(),
                                imageUrl: z.string().nullable(),
                                createdAt: z.string(),
                                hierarchy: z.number().nullable(),
                            })),
                        }),
                    },
                },
            },
            '400': {
                description: 'Failed to retrieve professionals',
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
            const findAllProfessionalUseCase = new FindAllProfessionalUseCase(professionalRepository);
            const professionals = await findAllProfessionalUseCase.execute();

            return {
                success: true,
                result: professionals.map(professional => ({
                    id: professional.id,
                    name: professional.name,
                    role: professional.role,
                    bio: professional.bio,
                    imageUrl: professional.imageUrl,
                    createdAt: professional.createdAt.toISOString(),
                    hierarchy: professional.hierarchy,
                })),
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to retrieve professionals',
            };
        }
    }
}