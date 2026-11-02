import formulesData from "@/data/formules.json";
import locationData from "@/data/location.json";
import { intlLocale, type Dict, type Locale } from "@/lib/i18n";

export type FormulaId = keyof Dict["traiteur"]["formulas"]["items"];
export type Formula = { id: FormulaId; priceFrom: number | null; minGuests: number | null };
export const formulas = formulesData.formules as Formula[];
export const isFormulaId = (v: string): v is FormulaId => formulas.some((f) => f.id === v);

export type RentalCat = keyof Dict["rental"]["cats"];
export type RentalUnit = keyof Dict["rental"]["units"];
export type RentalItem = { id: keyof Dict["rental"]["items"]; cat: RentalCat; img: string; priceFrom: number | null; unit: RentalUnit };
export const rentalCats = locationData.categories as RentalCat[];
export const rentalItems = locationData.items as RentalItem[];
export const getRental = (id: string) => rentalItems.find((i) => i.id === id);

export function euros(n: number, lang: Locale) {
  return new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}
