import { Public } from '@/auth/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
} from '@nestjs/terminus';

@Public()
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('google', 'https://google.com'),
        ]);
    }
}
