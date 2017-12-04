/** Instanciates an object type Pizza */
export class Pizza {
  /** Name of pizza */
  name: string;
  /** Total cost of pizza */
  cost: number;
  /** 
   * For inclusive ItemCategories, a boolean map keyed by ItemType id is stored under the ItemCategory id
   * 
   * For exclusive ItemCategories, an ItemType id is stored under the ItemCategory id (or null for none) 
  */
  [itemCatId: string]: number | string | {[itemTypeId: string]: boolean};
}
