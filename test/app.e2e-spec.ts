import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';

import {
  signUpRequest,
  signUpRequestMissingFields,
  signInRequest,
  signInRequestWrongPassword,
  signInRequestWrongEmail,
} from './dto';

describe('Application e2e test', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');

    prisma = app.get(PrismaService);
    await prisma.cleandb();
  })

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Sign Up', () => {
      it('Should Sign Up', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody(signUpRequest)
          .expectStatus(201)
      });

      it('Should fail if the user already exists', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody(signUpRequest)
          .expectStatus(403)
      });

      it('Should fail if a mandatory field is missing', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup',
          ).withBody(signUpRequestMissingFields)
          .expectStatus(400)
      });
    });

    describe('Sign In', () => {
      it('Should return an error when the password is incorrect', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin',
          ).withBody(signInRequestWrongPassword)
          .expectStatus(403)
      });

      it('Should return an error when the email is incorrect', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin',
          ).withBody(signInRequestWrongEmail)
          .expectStatus(403)
      });

      it('Should Sign in', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin',
          ).withBody(signInRequest)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      });
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('Should Get current user', () => {
        return pactum
          .spec()
          .get(
            '/users/me'
          ).withHeaders({
            Authorization: `bearer $S{userAt}`
          }).expectStatus(200)
          .inspect();

      });

      it('Should fail if user is not authenticated', () => {
        return pactum
          .spec()
          .get(
            '/users/me'
          ).expectStatus(401)
          .inspect();

      });
    });

    describe('Update current user', () => {
      it.todo('Should Edit current user');
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('Should Create a Bookmark');
    });

    describe('Get all bookmarks', () => {
      it.todo('Should get all Bookmarks');
    });

    describe('Get bookmark by ID', () => {
      it.todo('Should get a Bookmark by ID');
    });

    describe('Edit a bookmark', () => {
      it.todo('Should Edit a Bookmark');
    });

    describe('Delete a bookmark', () => {
      it.todo('Should Delete a Bookmark');
    });

  });
})