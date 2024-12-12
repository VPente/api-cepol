import { DeleteEquipmentUseCase } from 'application/use-cases/equipments/DeleteEquipmentUseCase';
import { Bool, OpenAPIRoute } from 'chanfana';
import { EquipmentRepository } from 'infrastructure/database/repositories/equipments/EquipmentRepository';
import { z } from 'zod';

const equipmentRepository = new EquipmentRepository();

export class DeleteEquipmentController extends OpenAPIRoute {
    schema = {
        tags: ['Equipments'],
        summary: 'Delete an existing equipment',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.number().min(1, { message: 'ID is required' }),
            }),
        },
        responses: {
            '200': {
                description: 'Equipment deleted successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            '404': {
                description: 'Equipment not found',
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
            const deleteEquipmentUseCase = new DeleteEquipmentUseCase(equipmentRepository);

            await deleteEquipmentUseCase.execute(id);

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Equipment deletion failed',
            };
        }
    }
}