import type { Searcher } from "../api.js";

function joinUrl(a: string, b: string) {
  if (b.startsWith(".")) {
    b = b.slice(1);
  }
  if (a.endsWith("/") && b.startsWith("/")) {
    return a + b.slice(1);
  } else if (!a.endsWith("/") && !b.startsWith("/")) {
    return a + "/" + b;
  } else {
    return a + b;
  }
}

/* Okay so here's what we want to have this implement: Given a query vector and
 * a limit, return the IDs of the nearest neighbors from the BQ table. This
 * frontend can't have permissions to interact with BQ directly, so it has to go
 * through the backend server. The backend server should have an endpoint that
 * takes a query string and a limit N, and returns the nearest neighbors.
 */

export class BackendSearcher implements Searcher {
  constructor(private serverUrl: string) {}

  async vectorSearch(
    query: string,
    options?: { limit: number; predicate: string | null; onStatus: (status: string) => void },
  ): Promise<{ id: any; distance?: number }[]> {
    const queryParams = new URLSearchParams({
      query: query,
      limit: (options?.limit ?? 10).toString(),
      predicate: options?.predicate ?? "",
    });
    const url = joinUrl(this.serverUrl, `vector_search?${queryParams.toString()}`);

    options?.onStatus?.(`Sending vector search request to backend: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Vector search request failed: ${response.status} ${response.statusText}`);
    }
    const results = await response.json();
    return results as { id: any; distance?: number }[];
  }
}
