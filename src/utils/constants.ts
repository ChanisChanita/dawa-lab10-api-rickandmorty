export const APP_CONFIG = {
  name: 'Rick and Morty Characters',
  description: 'Explora el multiverso de Rick and Morty',
  revalidateTime: 864000, // 10 días en segundos
} as const;

export const CHARACTER_STATUS = {
  ALIVE: 'Alive',
  DEAD: 'Dead',
  UNKNOWN: 'unknown'
} as const;

export const CHARACTER_GENDER = {
  FEMALE: 'Female',
  MALE: 'Male',
  GENDERLESS: 'Genderless',
  UNKNOWN: 'unknown'
} as const;

export const ROUTES = {
  HOME: '/',
  CHARACTERS: '/characters',
  SEARCH: '/search',
  CHARACTER_DETAIL: (id: string | number) => `/characters/${id}`
} as const;

export const STATUS_COLORS = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-500'
} as const;

export const GENDER_ICONS = {
  Male: '♂️',
  Female: '♀️',
  Genderless: '⚪',
  unknown: '❓'
} as const;