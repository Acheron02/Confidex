export interface Result {
  _id: string;
  user_id: string;
  productID: string;
  result: string;
  result_image?: string;
  createdAt?: string;
}

export async function fetchUserResults(userId: string): Promise<Result[]> {
  try {
    const res = await fetch(`/api/update_result?userId=${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch results");
    const data = await res.json();
    // Make sure the backend's `result_image` is included in each item
    return data.map((r: any) => ({
      ...r,
      result_image: r.result_image || "", 
    }));
  } catch (err) {
    console.error("fetchUserResults error:", err);
    return [];
  }
}
