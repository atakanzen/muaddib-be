import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Neat little trick, TypeScript will resolve same name exports based on use-case
export type AuthUser = {
    sub: number;
    username: string;
}

export const AuthUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as AuthUser;
    }
);
