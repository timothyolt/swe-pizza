export class Pizza {
  name: string;
  cost: number;
  [itemCatId: string]: number | string | {[itemTypeId: string]: boolean};
  // For inclusive ItemCategories, a boolean map keyed by ItemType id is stored under the ItemCategory id
  // For exclusive ItemCategories, an ItemType id is stored under the ItemCategory id (or null for none)
}
