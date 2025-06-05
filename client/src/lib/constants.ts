// Application constants and configuration

export const APP_CONFIG = {
  name: "TranslateFlow",
  description: "Translation Management System",
  version: "1.0.0",
} as const;

export const TRANSLATION_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  COMPLETED: "completed",
} as const;

export const CONTENT_STATUSES = {
  DRAFT: "draft",
  READY_FOR_TRANSLATION: "ready_for_translation",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  KOREAN_TRANSCRIBER: "korean_transcriber",
  ENGLISH_TRANSLATOR: "english_translator",
  REGIONAL_TRANSLATOR: "regional_translator",
} as const;

export const EXPORT_FORMATS = {
  DOCX: "docx",
  PDF: "pdf",
  TXT: "txt",
  SRT: "srt",
} as const;

export const LANGUAGES = {
  KOREAN: "ko",
  ENGLISH: "en",
  TAGALOG: "tl",
  BURMESE: "my",
  CEBUANO: "ceb",
  CZECH: "cs",
  GERMAN: "de",
  EWE: "ee",
  SPANISH: "es",
  FRENCH: "fr",
  HMONG: "hmn",
  ILOCANO: "ilo",
  JAPANESE: "ja",
  CHINESE: "zh",
  MONGOLIAN: "mn",
  NEPALI: "ne",
  PORTUGUESE: "pt",
  RUSSIAN: "ru",
  THAI: "th",
  VIETNAMESE: "vi",
} as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  ko: "Korean",
  en: "English",
  tl: "Tagalog",
  my: "Burmese",
  ceb: "Cebuano",
  cs: "Czech",
  de: "German",
  ee: "Ewe",
  es: "Spanish",
  fr: "French",
  hmn: "Hmong",
  ilo: "Ilocano",
  ja: "Japanese",
  zh: "Chinese",
  mn: "Mongolian",
  ne: "Nepali",
  pt: "Portuguese",
  ru: "Russian",
  th: "Thai",
  vi: "Vietnamese",
} as const;

export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-primary",
  high: "text-warning",
  urgent: "text-destructive",
} as const;

export const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "interjection",
  "pronoun",
  "determiner",
] as const;

export const GLOSSARY_CATEGORIES = [
  "theological",
  "general",
  "technical",
  "biblical",
  "liturgical",
  "cultural",
] as const;

export const ACTIVITY_ACTIONS = {
  UPLOADED: "uploaded",
  TRANSLATED: "translated",
  COMPLETED: "completed",
  REVIEWED: "reviewed",
  UPDATED: "updated",
  ADDED: "added",
  EXPORTED: "exported",
  ASSIGNED: "assigned",
} as const;

export const ENTITY_TYPES = {
  CONTENT: "content",
  PROJECT: "project",
  GLOSSARY: "glossary",
  USER: "user",
  EXPORT: "export",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_TYPES: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
  ],
  ALLOWED_AUDIO_TYPES: [
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/m4a",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
  ],
} as const;

export const API_ENDPOINTS = {
  CONTENTS: "/api/contents",
  TRANSLATION_PROJECTS: "/api/translation-projects",
  GLOSSARY: "/api/glossary",
  TRANSLATION_MEMORY: "/api/translation-memory",
  ACTIVITIES: "/api/activities",
  EXPORTS: "/api/exports",
  USERS: "/api/users",
  TRANSLATE: "/api/translate",
  UPLOAD: "/api/upload",
  DASHBOARD_STATS: "/api/dashboard/stats",
} as const;

export const KEYBOARD_SHORTCUTS = {
  SAVE: "Ctrl+S",
  AUTO_TRANSLATE: "Ctrl+T",
  NEW_PROJECT: "Ctrl+N",
  SEARCH: "Ctrl+K",
  TOGGLE_SIDEBAR: "Ctrl+B",
} as const;

export const TRANSLATION_MEMORY = {
  MIN_SIMILARITY: 70,
  MAX_SUGGESTIONS: 5,
  MIN_TEXT_LENGTH: 10,
} as const;

export const AUTO_SAVE = {
  DEBOUNCE_DELAY: 2000, // 2 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const THEME_COLORS = {
  PRIMARY: "hsl(213 94% 68%)", // #2563EB
  SECONDARY: "hsl(210 6% 46%)", // #64748B
  ACCENT: "hsl(142 76% 36%)", // #10B981
  WARNING: "hsl(45 93% 47%)", // #F59E0B
  DESTRUCTIVE: "hsl(0 84% 60%)", // #EF4444
  MUTED: "hsl(210 11% 96%)", // #F1F3F4
  BORDER: "hsl(210 11% 90%)", // #E9ECEF
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  FILE_TOO_LARGE: "File size exceeds the maximum allowed limit.",
  UNSUPPORTED_FILE_TYPE: "This file type is not supported.",
  TRANSLATION_FAILED: "Translation failed. Please try again or contact support.",
  EXPORT_FAILED: "Export failed. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CONTENT_UPLOADED: "Content uploaded successfully",
  TRANSLATION_SAVED: "Translation saved successfully",
  PROJECT_CREATED: "Translation project created successfully",
  GLOSSARY_TERM_ADDED: "Glossary term added successfully",
  EXPORT_COMPLETED: "Export completed successfully",
  USER_CREATED: "User created successfully",
} as const;
