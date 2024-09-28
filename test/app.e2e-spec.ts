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
  createBookmarkRequest,
  createBookmarkRequestMissingField,
  editUserRequestAll,
  editUserRequestEmail,
  editUserRequestFirstName,
  editUserRequestLastName,
  editUserRequestNotEmail,
  editUserRequestWrongType,
  createBookmarkRequestWrongType,
  editBookmarkSuccessfullyRequest,
  editBookmarkWrongTypeRequest,
} from './dto';

describe('Application e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');

    prisma = app.get(PrismaService);
    await prisma.cleandb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Sign Up', () => {
      it('Should Sign Up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signUpRequest)
          .expectStatus(201);
      });

      it('Should fail if the user already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signUpRequest)
          .expectStatus(403)
          .expectBody({
            statusCode: 403,
            error: 'Forbidden',
            message: 'Email already exists',
          });
      });

      it('Should fail if a mandatory field is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signUpRequestMissingFields)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: [
              'firstName should not be empty',
              'firstName must be a string',
              'lastName should not be empty',
              'lastName must be a string',
            ],
            error: 'Bad Request',
          });
      });
    });

    describe('Sign In', () => {
      it('Should return an error when the password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInRequestWrongPassword)
          .expectStatus(403)
          .expectBody({
            statusCode: 403,
            message: 'Email or password is incorrect',
            error: 'Forbidden',
          });
      });

      it('Should return an error when the email is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInRequestWrongEmail)
          .expectStatus(403)
          .expectBody({
            statusCode: 403,
            message: 'Email or password is incorrect',
            error: 'Forbidden',
          });
      });

      it('Should Sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInRequest)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('Should Get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(200);
      });

      it('Should fail if user is not authenticated', () => {
        return pactum.spec().get('/users/me').expectStatus(401).expectBody({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
    });

    describe('Update current user', () => {
      it('should fail if user is not authenticated', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(editUserRequestEmail)
          .expectStatus(401)
          .expectBody({
            statusCode: 401,
            message: 'Unauthorized',
          });
      });

      it('Should Edit current user with all fields', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestAll)
          .expectStatus(200)
          .expectBodyContains(editUserRequestAll.email)
          .expectBodyContains(editUserRequestAll.firstName)
          .expectBodyContains(editUserRequestAll.lastName);
      });

      it('Should Edit current user with email only', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestEmail)
          .expectStatus(200)
          .expectBodyContains(editUserRequestEmail.email);
      });

      it('Should Edit current user with first name only', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestFirstName)
          .expectStatus(200)
          .expectBodyContains(editUserRequestFirstName.firstName);
      });

      it('Should Edit current user with last name only', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestLastName)
          .expectStatus(200)
          .expectBodyContains(editUserRequestLastName.lastName);
      });

      it('Should fail if the email is not an email', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestNotEmail)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          });
      });

      it('Should fail if a field is of the wrong type', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editUserRequestWrongType)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['firstName must be a string'],
            error: 'Bad Request',
          });
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it('Should Fail if user is not authenticated', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(createBookmarkRequest)
          .expectStatus(401)
          .expectBody({
            statusCode: 401,
            message: 'Unauthorized',
          });
      });
      it('Should Fail if a mandatory field is missing', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(createBookmarkRequestMissingField)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['title should not be empty', 'title must be a string'],
            error: 'Bad Request',
          });
      });
      it('Should Fail if a field is of the wrong type', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(createBookmarkRequestWrongType)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['title must be a string'],
            error: 'Bad Request',
          });
      });
      it('Should Create a Bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(createBookmarkRequest)
          .expectStatus(201)
          .expectBodyContains(createBookmarkRequest.title)
          .expectBodyContains(createBookmarkRequest.description)
          .expectBodyContains(createBookmarkRequest.link)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get all bookmarks', () => {
      it('Should fail if user is not authenticated', () => {
        return pactum.spec().get('/bookmarks').expectStatus(401).expectBody({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
      it("Should get all the current user's Bookmarks", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by ID', () => {
      it('Should fail if user is not authenticated', () => {
        return pactum.spec().get('/bookmarks/1').expectStatus(401).expectBody({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
      it('Should fail if bookmark is not found', () => {
        return pactum
          .spec()
          .get('/bookmarks/1498567')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(404)
          .expectBody({
            statusCode: 404,
            error: 'Not Found',
            message: 'Bookmark with ID 1498567 not found',
          });
      });
      it('Should get a Bookmark by ID', () => {
        return pactum
          .spec()
          .get('/bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBodyContains(createBookmarkRequest.title)
          .expectBodyContains(createBookmarkRequest.description)
          .expectBodyContains(createBookmarkRequest.link);
      });
    });

    describe('Edit a bookmark', () => {
      it('Should fail if user is not authenticated', () => {
        return pactum
          .spec()
          .patch('/bookmarks/$S{bookmarkId}')
          .withBody(editBookmarkSuccessfullyRequest)
          .expectStatus(401)
          .expectBody({
            statusCode: 401,
            message: 'Unauthorized',
          });
      });
      it('Should fail if a field is of the wrong type', () => {
        return pactum
          .spec()
          .patch('/bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editBookmarkWrongTypeRequest)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['title must be a string'],
            error: 'Bad Request',
          });
      });
      it('Should fail if the bookmark is not found', () => {
        return pactum
          .spec()
          .patch('/bookmarks/1498567')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editBookmarkSuccessfullyRequest)
          .expectStatus(404)
          .expectBody({
            statusCode: 404,
            error: 'Not Found',
            message: 'Bookmark with ID 1498567 not found',
          });
      });
      it('Should Edit a Bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .withBody(editBookmarkSuccessfullyRequest)
          .expectStatus(200)
          .expectBodyContains(editBookmarkSuccessfullyRequest.title)
          .expectBodyContains(editBookmarkSuccessfullyRequest.description)
          .expectBodyContains(editBookmarkSuccessfullyRequest.link);
      });
    });

    describe('Delete a bookmark', () => {
      it('Should fail if user is not authenticated', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}')
          .expectStatus(401)
          .expectBody({
            statusCode: 401,
            message: 'Unauthorized',
          });
      });
      it('Should fail if the bookmark is not found', () => {
        return pactum
          .spec()
          .delete('/bookmarks/1498567')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(404)
          .expectBody({
            statusCode: 404,
            error: 'Not Found',
            message: 'Bookmark with ID 1498567 not found',
          });
      });
      it('Should Delete a Bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
    });
  });
});
