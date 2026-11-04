import { CurrencyType } from '../currencies/entities/currency-entry.entity';
import { SEARCH_GROUP_LIMIT, SearchService } from './search.service';

interface QueryBuilderStub {
  where: jest.Mock;
  andWhere: jest.Mock;
  innerJoinAndSelect: jest.Mock;
  orderBy: jest.Mock;
  take: jest.Mock;
  getMany: jest.Mock;
}

function queryBuilderReturning(
  rows: unknown[],
  takeSpy?: jest.Mock,
): QueryBuilderStub {
  const qb = {} as QueryBuilderStub;
  for (const method of [
    'where',
    'andWhere',
    'innerJoinAndSelect',
    'orderBy',
  ] as const) {
    qb[method] = jest.fn(() => qb);
  }
  qb.take = jest.fn((limit: number) => {
    takeSpy?.(limit);
    return qb;
  });
  qb.getMany = jest.fn().mockResolvedValue(rows);
  return qb;
}

describe('SearchService', () => {
  const course = {
    id: 'course-1',
    title: 'Bitcoin fundamentals',
    description: 'An introduction to Bitcoin',
    difficulty: 'Beginner',
    tags: ['bitcoin'],
    thumbnailUrl: null,
  };
  const lesson = {
    id: 'lesson-1',
    title: 'How Bitcoin mining works',
    courseId: 'course-1',
    course: { title: 'Bitcoin fundamentals' },
  };
  const currency = {
    id: 'currency-1',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: CurrencyType.CRYPTO,
    logoUrl: null,
  };

  function buildService(
    rows = { courses: [course], lessons: [lesson], currencies: [currency] },
  ) {
    const takeSpy = jest.fn();
    const courseRepository = {
      createQueryBuilder: jest.fn(() =>
        queryBuilderReturning(rows.courses, takeSpy),
      ),
    };
    const lessonRepository = {
      createQueryBuilder: jest.fn(() =>
        queryBuilderReturning(rows.lessons, takeSpy),
      ),
    };
    const currencyRepository = {
      createQueryBuilder: jest.fn(() =>
        queryBuilderReturning(rows.currencies, takeSpy),
      ),
    };
    const service = new SearchService(
      courseRepository as never,
      lessonRepository as never,
      currencyRepository as never,
    );
    return {
      service,
      takeSpy,
      courseRepository,
      lessonRepository,
      currencyRepository,
    };
  }

  it('returns empty groups for a blank query without hitting the database', async () => {
    const { service, courseRepository } = buildService();

    await expect(service.search('   ')).resolves.toEqual({
      courses: [],
      lessons: [],
      currencies: [],
    });
    expect(courseRepository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('returns mapped results limited to five per category', async () => {
    const { service, takeSpy } = buildService();

    const result = await service.search('  BITCOIN ');

    expect(result.courses).toEqual([
      {
        id: 'course-1',
        title: 'Bitcoin fundamentals',
        description: 'An introduction to Bitcoin',
        difficulty: 'Beginner',
        tags: ['bitcoin'],
        thumbnailUrl: null,
      },
    ]);
    expect(result.lessons).toEqual([
      {
        id: 'lesson-1',
        title: 'How Bitcoin mining works',
        courseId: 'course-1',
        courseTitle: 'Bitcoin fundamentals',
      },
    ]);
    expect(result.currencies).toEqual([
      {
        id: 'currency-1',
        name: 'Bitcoin',
        symbol: 'BTC',
        type: CurrencyType.CRYPTO,
        logoUrl: null,
      },
    ]);
    expect(takeSpy).toHaveBeenCalledTimes(3);
    expect(takeSpy).toHaveBeenCalledWith(SEARCH_GROUP_LIMIT);
  });
});
