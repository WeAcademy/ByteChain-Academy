import { CurrencyType } from '../../currencies/entities/currency-entry.entity';

export interface CourseSearchResult {
  id: string;
  title: string;
  description: string;
  difficulty: string | null;
  tags: string[];
  thumbnailUrl: string | null;
}

export interface LessonSearchResult {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
}

export interface CurrencySearchResult {
  id: string;
  name: string;
  symbol: string;
  type: CurrencyType;
  logoUrl: string | null;
}

export interface SearchResults {
  courses: CourseSearchResult[];
  lessons: LessonSearchResult[];
  currencies: CurrencySearchResult[];
}
