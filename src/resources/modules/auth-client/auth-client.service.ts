import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jsonwebtoken from 'jsonwebtoken';
import { AuthClientEntity } from './entities/auth-client.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create-auth-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthClientService {
  constructor(
    @InjectRepository(AuthClientEntity)
    private authClientReposistory: Repository<AuthClientEntity>,
  ) {}

  private createToken(userId: string) {
    return jsonwebtoken.sign({ id: userId }, process.env.ACCESS_TOKEN_CLIENT, {
      expiresIn: '1d',
    });
  }

  async authService(data: CreateDto) {
    try {
      const clientExists = await this.authClientReposistory.findOneBy({
        client: data.client,
      });

      if (!clientExists) {
        throw new HttpException('CLIENT NOT EXISTS!', HttpStatus.BAD_REQUEST);
      }

      const { password } = clientExists;

      const passwordConfirm = await bcrypt.compare(data.password, password);

      // verfica a senha esta correta
      if (!passwordConfirm) {
        throw new HttpException('client not available', HttpStatus.BAD_REQUEST);
      }

      // tokens
      const accessToken = this.createToken(clientExists.password);

      return {
        token: accessToken,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createService(data: CreateDto) {
    try {
      const clientExists = await this.authClientReposistory.findOneBy({
        client: data.client,
      });

      if (clientExists) {
        throw new HttpException(
          'Email já utilizado ou incorreto!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordEncrypt = await bcrypt.hash(data.password, 10);

      data.password = passwordEncrypt;

      if (!passwordEncrypt) {
        throw new HttpException(
          'Encrypt error!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const client = this.authClientReposistory.create(data);

      const clientCreated = await this.authClientReposistory.save(client);

      // tokens
      const accessToken = this.createToken(clientCreated.password);

      return {
        client: clientCreated,
        token: accessToken,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
