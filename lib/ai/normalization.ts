// Normalize array
export function normalizeArray(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }

  if (Array.isArray(value)) {
    const filtered = value
      .map((v) => String(v).trim())
      .filter((v) => v.length > 0);
    return filtered.length > 0 ? filtered : [];
  }
  return [];
}

// Normalize date to ISO 8601
export function normalizeDate(value: unknown): string | null {
  if (!value) return null;

  try {
    const date = new Date(
      typeof value === 'number' ? value : String(value).trim()
    );
    if (isNaN(date.getTime())) return null;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

//Normalize boolean
export function normalizeBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase();
  if (str === 'true' || str === 'yes') return true;
  if (str === 'false' || str === 'no') return false;
  return null;
}

//Normalize number
export function normalizeNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

//Normalize enum value
export function normalizeEnum(
  value: any,
  validValues: string[]
): string | null {
  if (!value) return null;
  const normalized = String(value).toUpperCase().trim();
  return validValues.includes(normalized) ? normalized : null;
}

//Normalize falsy value
export function normalize(value: any) {
  return value === null || value === undefined || value === '' ? null : value;
}
