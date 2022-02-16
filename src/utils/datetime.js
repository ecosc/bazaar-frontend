import { getLocale } from "localization";

export function timestampInLocale(ts) {
    const date = new Date(ts * 1000);
    const locale = getLocale();

    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'medium' }).format(date);
}