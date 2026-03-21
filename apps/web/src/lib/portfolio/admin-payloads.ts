import type { LocalizedText } from "@/lib/i18n";
import type {
  ExperienceMutationInput,
  ProfileMutationInput,
  ProjectMutationInput,
  ProjectStatus,
} from "@/lib/portfolio/contracts";
import { splitLines, toSlug } from "@/lib/utils";

function asObject(value: unknown, field: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown, field: string) {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  return value.trim();
}

function asBoolean(value: unknown, field: string) {
  if (typeof value !== "boolean") {
    throw new Error(`${field} must be a boolean`);
  }

  return value;
}

function asStringArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }

  return value.map((item, index) => asString(item, `${field}[${index}]`));
}

function asLocalizedText(value: unknown, field: string): LocalizedText {
  const object = asObject(value, field);

  return {
    ko: asString(object.ko, `${field}.ko`),
    en: asString(object.en, `${field}.en`),
  };
}

function asLocalizedTextArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }

  return value.map((item, index) => asLocalizedText(item, `${field}[${index}]`));
}

function asProjectStatus(value: unknown, field: string): ProjectStatus {
  const status = asString(value, field);

  if (status !== "live" && status !== "pilot" && status !== "confidential") {
    throw new Error(`${field} must be a valid project status`);
  }

  return status;
}

function sanitizeLocalizedLines(value: LocalizedText[]) {
  return value
    .map((entry) => ({
      ko: splitLines(entry.ko).join(" ").trim(),
      en: splitLines(entry.en).join(" ").trim(),
    }))
    .filter((entry) => entry.ko.length > 0 || entry.en.length > 0);
}

export function parseProjectMutationInput(body: unknown): ProjectMutationInput {
  const object = asObject(body, "body");

  return {
    slug: toSlug(asString(object.slug, "slug")),
    status: asProjectStatus(object.status, "status"),
    featured: asBoolean(object.featured, "featured"),
    title: asLocalizedText(object.title, "title"),
    summary: asLocalizedText(object.summary, "summary"),
    role: asLocalizedText(object.role, "role"),
    client: asLocalizedText(object.client, "client"),
    period: asString(object.period, "period"),
    stack: asStringArray(object.stack, "stack").filter(Boolean),
    highlights: sanitizeLocalizedLines(
      asLocalizedTextArray(object.highlights, "highlights"),
    ),
  };
}

export function parseExperienceMutationInput(
  body: unknown,
): ExperienceMutationInput {
  const object = asObject(body, "body");

  return {
    company: asString(object.company, "company"),
    team: asLocalizedText(object.team, "team"),
    role: asLocalizedText(object.role, "role"),
    period: asString(object.period, "period"),
    location: asLocalizedText(object.location, "location"),
    summary: asLocalizedText(object.summary, "summary"),
    achievements: sanitizeLocalizedLines(
      asLocalizedTextArray(object.achievements, "achievements"),
    ),
    stack: asStringArray(object.stack, "stack").filter(Boolean),
    current: asBoolean(object.current, "current"),
  };
}

export function parseProfileMutationInput(body: unknown): ProfileMutationInput {
  const object = asObject(body, "body");

  return {
    fullName: asString(object.fullName, "fullName"),
    koreanName: asString(object.koreanName, "koreanName"),
    title: asLocalizedText(object.title, "title"),
    strapline: asLocalizedText(object.strapline, "strapline"),
    intro: asLocalizedText(object.intro, "intro"),
    location: asLocalizedText(object.location, "location"),
    availability: asLocalizedText(object.availability, "availability"),
    biography: sanitizeLocalizedLines(
      asLocalizedTextArray(object.biography, "biography"),
    ),
    specialties: sanitizeLocalizedLines(
      asLocalizedTextArray(object.specialties, "specialties"),
    ),
  };
}
