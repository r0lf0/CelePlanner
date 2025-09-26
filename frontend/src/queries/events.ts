import { useQuery } from "vue-query";
import { BASE_URL } from "./common";
import { customFetch } from "./customFetch";
import type { CelePlannerEvent } from "@/types/event";

export function useEventsQuery() {
  return useQuery(
    "events",
    async (): Promise<CelePlannerEvent[]> =>
      await customFetch(`${BASE_URL}/events`).then((res) => res.json())
  );
}
