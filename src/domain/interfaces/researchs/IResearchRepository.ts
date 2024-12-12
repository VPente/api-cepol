import { Research } from "domain/entities/researchs/Research";

export interface IResearchRepository {
    create(article: Partial<Research>): Promise<Research>;
    findById(id: number): Promise<Research | null>;
    findAll(): Promise<Research[]>;
    update(article: Partial<Research>): Promise<Research>;
    delete(id: number): Promise<void>;
}
