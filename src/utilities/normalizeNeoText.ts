const NEO_ACCENT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/[ÈÉÊË]/g, "E'"],
  [/[èéêë]/g, "e'"],
  [/[ÀÁÂÃÄÅ]/g, "A'"],
  [/[àáâãäå]/g, "a'"],
  [/[ÒÓÔÕÖ]/g, "O'"],
  [/[òóôõö]/g, "o'"],
  [/[ÙÚÛÜ]/g, "U'"],
  [/[ùúûü]/g, "u'"],
  [/[ÌÍÎÏ]/g, "I'"],
  [/[ìíîï]/g, "i'"],
]

export const normalizeNeoText = (value: unknown): unknown => {
  if (typeof value !== 'string') return value

  return NEO_ACCENT_REPLACEMENTS.reduce((result, [regex, replacement]) => {
    return result.replace(regex, replacement)
  }, value)
}

export const normalizeNeoString = (value: string): string => {
  return normalizeNeoText(value) as string
}
