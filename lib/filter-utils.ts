/**
 * Filter utilities for LAMT Design System
 * Migrated from @lamt/components filters/utils.ts
 */

import { RadioOption } from '@/components/lamt/radio-group';

export const DATE_RANGE_STRING_DELIMITER = ' ';

export enum FilterType {
  Date = 'date',
  Str = 'string',
  Phone = 'phone',
  Num = 'numerical',
  Time = 'timestamp',
  Percent = 'percent',
  Select = 'select',
}

export enum Method {
  Contains = 'ct',
  DoesNotContain = '_ct',
  Equals = 'eq',
  GreaterThan = 'gt',
  GreaterOrEqualThan = 'gte',
  LessThan = 'lt',
  LessOrEqualThan = 'lte',
  Between = 'bt',
}

export const TEXT_METHODS = [
  { value: Method.Contains, label: 'Contains' },
  {
    value: Method.DoesNotContain,
    label: 'Does not contain',
  },
  { value: Method.Equals, label: 'Equals' },
];

export const SELECT_METHODS = [
  { value: Method.Equals, label: 'Equals' },
  {
    value: Method.DoesNotContain,
    label: 'Does not contain',
  },
];

export const NUM_METHODS = [
  { value: Method.GreaterThan, label: 'Greater than' },
  { value: Method.LessThan, label: 'Less than' },
  { value: Method.Equals, label: 'Equals' },
];

export const DATE_METHODS = [
  { value: Method.GreaterThan, label: 'After' },
  { value: Method.LessThan, label: 'Before' },
  { value: Method.Between, label: 'Between' },
];

export function getMethods(type: FilterType): RadioOption[] {
  switch (type) {
    case FilterType.Num:
    case FilterType.Percent:
      return NUM_METHODS;
    case FilterType.Date:
    case FilterType.Time:
      return DATE_METHODS;
    case FilterType.Select:
      return SELECT_METHODS;
    case FilterType.Str:
    case FilterType.Phone:
    default:
      return TEXT_METHODS;
  }
}

export function getPlaceholder(type: FilterType): string {
  switch (type) {
    case FilterType.Num:
      return 'e.g: 10';
    case FilterType.Percent:
      return 'e.g: 5%';
    case FilterType.Date:
    case FilterType.Time:
      return `e.g: 31/03/${new Date().getFullYear()}`;
    case FilterType.Phone:
      return 'e.g: +34 123 456 7890';
    case FilterType.Select:
      return 'Select';
    case FilterType.Str:
    default:
      return 'e.g: This text';
  }
}
