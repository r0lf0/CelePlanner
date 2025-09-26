import { useQuery } from "vue-query";
import { BASE_URL } from "./common";
import { customFetch } from "./customFetch";
import type { CelePlannerEvent } from "@/types/event";
import { parse } from "date-fns";

export function useEventsQuery() {
  return useQuery(
    "events",
    async (): Promise<CelePlannerEvent[]> =>
      await customFetch(`${BASE_URL}/events`).then((res) =>
        res.json().then((data) =>
          data.map((event: any) => ({
            ...event,
            eventDate: parse(event.eventDate, "yyyy-MM-dd", new Date()),
          }))
        )
      )
  );
}
