export const VALID_TABS = ["BUG", "FEATURE_REQUEST", "GENERAL"] as const
export type TabValue = (typeof VALID_TABS)[number]

export const isValidTab = (value: unknown): value is TabValue =>
    VALID_TABS.includes(value as TabValue)

export const VALID_SORTS = ["votes", "date"] as const
export type SortValue = (typeof VALID_SORTS)[number]

export const isValidSort = (value: unknown): value is SortValue =>
    VALID_SORTS.includes(value as SortValue)
