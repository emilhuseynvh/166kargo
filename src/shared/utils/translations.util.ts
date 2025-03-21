export const mapTranslation = (item) => {
    return {
        ...item,
        translation: undefined,
        ...Object.fromEntries(item.translation.map((t) => [t.field, t.value])),
    };
};