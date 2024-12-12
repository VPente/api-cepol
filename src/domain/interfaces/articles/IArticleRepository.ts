import { Article } from "../../entities/articles/Article";

export interface IArticleRepository {
    create(article: Partial<Article>): Promise<Article>;
    findById(id: number): Promise<Article | null>;
    findAll(): Promise<Article[]>;
    update(article: Partial<Article>): Promise<Article>;
    delete(id: number): Promise<void>;
}
