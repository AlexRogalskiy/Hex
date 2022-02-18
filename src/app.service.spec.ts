import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { Game } from './entities/game.entity';
import { User } from './entities/user.entity';
import {
  parseGameStateFromMultilineString,
  parseGameFromMultilineString,
} from './common/utils';

let mockedGame: Game;
let mockedUser: User;

const mockGamesRepository = {
  findOne: (id: number): Promise<Game> => {
    return new Promise((resolve, reject) => {
      resolve(mockedGame);
    });
  },
  save: (game: Game): Game => {
    return game;
  },
  create: (game: Game): Game => {
    return game;
  },
};

const mockUsersRepository = {
  findOne: (id: number): Promise<User> => {
    return new Promise((resolve, reject) => {
      resolve(mockedUser);
    });
  },
  save: (user: User): User => {
    return user;
  },
  create: (user: User): User => {
    return user;
  },
};

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGamesRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('file', () => {
    it('should return the current game state from the file"', () => {
      expect(appService.getBoardStateFromFile()).toEqual(
        parseGameStateFromMultilineString(`
⬢ ⬡ ⬢
 ⬡ W ⬡
  ⬡ ⬡ ⬡
`),
      );
    });
    it('should throw an error if trying to set a stone in a already filled cell"', async () => {
      await expect(
        appService.updateGameState(
          parseGameFromMultilineString(`
      ⬢ ⬡ ⬢
       ⬡ W ⬡
        ⬡ ⬡ ⬡
      `),
          { x: 1, y: 1 },
        ),
      ).rejects.toThrowError();
    });
  });
  it('should return the current game state from the file with still a black stone in [0,0]"', async () => {
    const game = parseGameFromMultilineString(`
    ⬡ ⬡ ⬢
     ⬡ W ⬡
      ⬡ ⬡ ⬡
    `);
    game.state.turn = 'black';
    expect(
      (await appService.updateGameState(game, { x: 0, y: 0 })).state,
    ).toEqual(
      parseGameStateFromMultilineString(`
⬢ ⬡ ⬢
 ⬡ W ⬡
  ⬡ ⬡ ⬡
`),
    );
  });

  describe('root', () => {
    it('should return an empty board of 11x11"', async () => {
      expect((await appService.createNewGame(11, "sessionID")).state.board).toEqual(
        parseGameStateFromMultilineString(`
⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
 ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
  ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
     ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
      ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
       ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
        ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
         ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
          ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
       `).board,
      );
    });
  });
  it('should return a board of 11x11 with a white stone in [1,1]"', async () => {
    expect(
      (
        await appService.updateGameState(await appService.createNewGame(11, "sessionID"), {
          x: 1,
          y: 1,
        })
      ).state.board,
    ).toEqual(
      parseGameStateFromMultilineString(`
⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
 ⬡ W ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
  ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
     ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
      ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
       ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
        ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
         ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
          ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
`).board,
    );
  });
});
