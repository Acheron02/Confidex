// app/utils/fetchTransaction.ts
export interface TransactionItem {
  name: string;
  productID: string;
  result: string;
}

export interface Transaction {
  _id: string;
  user_id: string;
  status: string;
  items: TransactionItem[];
  purchasedDate?: string; // optional now
}

export const fetchUserTransactions = async (
  user_id: string
): Promise<Transaction[]> => {
  try {
    const res = await fetch(`/api/transaction?user_id=${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");

    const data = await res.json();

    // Ensure purchasedDate is a string or undefined
    const transactions: Transaction[] = (data.transactions ?? []).map(
      (tx: any) => ({
        ...tx,
        purchasedDate: tx.purchasedDate ? String(tx.purchasedDate) : undefined,
      })
    );

    return transactions;
  } catch (err) {
    console.error(err);
    return [];
  }
};
