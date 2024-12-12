import { DeleteProfessionalUseCase } from 'application/use-cases/professionals/DeleteProfessionalUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { ProfessionalRepository } from 'infrastructure/database/repositories/professionals/ProfessionalRepository';
import { z } from 'zod';

const professionalRepository = new ProfessionalRepository();

export class DeleteProfessionalController extends OpenAPIRoute {
    schema = {
        tags: ['Professionals'],
        summary: 'Delete an existing professional',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' }),
            }),
        },
        responses: {
            '200': {
                description: 'Professional deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            '404': {
                description: 'Professional not found',
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
            const deleteProfessionalUseCase = new DeleteProfessionalUseCase(professionalRepository);

            await deleteProfessionalUseCase.execute(id);

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Professional deletion failed',
            };
        }
    }
}