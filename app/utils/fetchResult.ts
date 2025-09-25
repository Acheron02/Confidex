export interface Result {
  _id: string;
  user_id: string;
  productID: string;
  result: string;
  createdAt?: string;
}

export async function fetchUserResults(userId: string): Promise<Result[]> {
  try {
    const res = await fetch(`/api/update_result?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch results");
    return await res.json();
  } catch (err) {
    console.error("fetchUserResults error:", err);
    return [];
  }
}
