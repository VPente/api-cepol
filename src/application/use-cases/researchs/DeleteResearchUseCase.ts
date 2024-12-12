import { IResearchRepository } from "domain/interfaces/researchs/IResearchRepository";

export class DeleteResearchUseCase {
    constructor(private researchRepository: IResearchRepository) { }

    async execute(id: number): Promise<void> {
        const Research = await this.researchRepository.findById(id);

        if (!Research) {
            throw new Error('Research not found');
        }

        await this.researchRepository.delete(id);
    }
}











