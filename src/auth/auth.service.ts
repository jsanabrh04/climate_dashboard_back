import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly adminEmail: string;
  private readonly adminPassword: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.adminEmail = this.config.get<string>('ADMIN_EMAIL');
    this.adminPassword = this.config.get<string>('ADMIN_PASSWORD');
  }

  async validateUser(email: string, password: string): Promise<{ email: string }> {
    if (email !== this.adminEmail || password !== this.adminPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return { email };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
