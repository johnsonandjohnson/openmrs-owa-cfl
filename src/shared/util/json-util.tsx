export const parseJson = (value, defaultValue = [] as any) => (value ? JSON.parse(value) : defaultValue);
