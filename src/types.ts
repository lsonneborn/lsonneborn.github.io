interface Item {
  _id: number;
  name: string;
  inStock: boolean;
  bestBeforeDate: Date | null;
  storeDays: number;
  category: string;
}
