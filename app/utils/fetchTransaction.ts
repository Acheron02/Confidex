// app/utils/fetchTransaction.ts
export interface TransactionItem {
  name: string;
  productID: string;
}

export interface Transaction {
  _id: string;
  user_id: string;
  status: string;
  items: TransactionItem[];
  purchasedDate?: string;
}

export const fetchUserTransactions = async (
  user_id: string
): Promise<Transaction[]> => {
  try {
    const res = await fetch(`/api/transaction?user_id=${user_id}`, {
      cache: "no-store", // make sure you always get fresh data
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");

    const data = await res.json();

    const transactions: Transaction[] = (data.transactions ?? []).map(
      (tx: any) => ({
        _id: String(tx._id),
        user_id: String(tx.user_id),
        status: tx.status,
        items: tx.items.map((item: any) => ({
          name: item.name,
          productID: item.productID,
        })),
        purchasedDate: tx.purchasedDate
          ? new Date(tx.purchasedDate).toISOString()
          : undefined,
      })
    );

    return transactions;
  } catch (err) {
    console.error("fetchUserTransactions error:", err);
    return [];
  }
};
