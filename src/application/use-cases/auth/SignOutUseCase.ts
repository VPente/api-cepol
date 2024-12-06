import { IAuthService } from '../../../domain/interfaces/auth/IAuthService';

export class SignOutUseCase {
    constructor(private authService: IAuthService) { }

    async execute() {
        return await this.authService.signOut();
    }
}
