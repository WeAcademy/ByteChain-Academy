import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CurrencyEntry } from '../currencies/entities/currency-entry.entity';
import {
  CourseSearchResult,
  CurrencySearchResult,
  LessonSearchResult,
  SearchResults,
} from './dto/search-response.dto';

/** Maximum number of results returned per category. */
export const SEARCH_GROUP_LIMIT = 5;

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(CurrencyEntry)
    private readonly currencyRepository: Repository<CurrencyEntry>,
  ) {}

  /**
   * Searches published courses, published lessons and currencies.
   *
   * `LOWER(...) LIKE :term` is used instead of PostgreSQL `ILIKE` so the same
   * query works against the SQLite database used in development and CI.
   */
  async search(rawQuery: string): Promise<SearchResults> {
    const query = rawQuery.trim();
    if (!query) {
      return { courses: [], lessons: [], currencies: [] };
    }

    const term = `%${query.toLowerCase()}%`;

    const [courses, lessons, currencies] = await Promise.all([
      this.courseRepository
        .createQueryBuilder('course')
        .where('course.published = :published', { published: true })
        .andWhere(
          '(LOWER(course.title) LIKE :term OR LOWER(course.description) LIKE :term)',
          { term },
        )
        .orderBy('course.title', 'ASC')
        .take(SEARCH_GROUP_LIMIT)
        .getMany(),

      this.lessonRepository
        .createQueryBuilder('lesson')
        .innerJoinAndSelect('lesson.course', 'course')
        .where('lesson.published = :published', { published: true })
        .andWhere('course.published = :published', { published: true })
        .andWhere('LOWER(lesson.title) LIKE :term', { term })
        .orderBy('lesson.title', 'ASC')
        .take(SEARCH_GROUP_LIMIT)
        .getMany(),

      this.currencyRepository
        .createQueryBuilder('currency')
        .where(
          '(LOWER(currency.name) LIKE :term OR LOWER(currency.symbol) LIKE :term)',
          { term },
        )
        .orderBy('currency.name', 'ASC')
        .take(SEARCH_GROUP_LIMIT)
        .getMany(),
    ]);

    return {
      courses: courses.map(
        (course): CourseSearchResult => ({
          id: course.id,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          tags: course.tags ?? [],
          thumbnailUrl: course.thumbnailUrl,
        }),
      ),
      lessons: lessons.map(
        (lesson): LessonSearchResult => ({
          id: lesson.id,
          title: lesson.title,
          courseId: lesson.courseId,
          courseTitle: lesson.course?.title ?? '',
        }),
      ),
      currencies: currencies.map(
        (currency): CurrencySearchResult => ({
          id: currency.id,
          name: currency.name,
          symbol: currency.symbol,
          type: currency.type,
          logoUrl: currency.logoUrl ?? null,
        }),
      ),
    };
  }
}
