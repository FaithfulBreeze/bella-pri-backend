export function sanitizeCategoryIds(input?: string | number[]): number[] | undefined {
  if (!input) return undefined;

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);

      if (Array.isArray(parsed)) {
        return parsed.map((id) => Number(id)).filter((id) => !isNaN(id));
      }
    } catch (err) {
      return undefined;
    }
  } else if (Array.isArray(input)) {
    return input.map((id) => Number(id)).filter((id) => !isNaN(id));
  }

  return undefined;
}
