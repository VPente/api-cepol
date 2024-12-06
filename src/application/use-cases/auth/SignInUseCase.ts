import { IAuthService } from "domain/interfaces/auth/IAuthService";

export class SignInUseCase {
    constructor(private authService: IAuthService) { }

    async execute(email: string, password: string) {
        return await this.authService.signIn(email, password);
    }
}
