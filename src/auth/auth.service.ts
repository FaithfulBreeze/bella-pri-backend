import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly adminUser: string;
  private readonly adminPass: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.adminUser = this.configService.get<string>('ADMIN_USER') || '';
    this.adminPass = this.configService.get<string>('ADMIN_PASS') || '';
  }

  async validateUser(username: string, password: string) {
    if (username === this.adminUser && password === this.adminPass) {
      return { username };
    }
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  async login(user: any) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
