import { QUERY_PARAMS } from "./constants";

export function getQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);
  const fromDate = queryParams.get(QUERY_PARAMS.FROM_DATE);
  const toDate = queryParams.get(QUERY_PARAMS.TO_DATE);
  const mode: "since" | "until" = queryParams.get(QUERY_PARAMS.MODE) as
    | "since"
    | "until";
  const quickSelect = queryParams.get(QUERY_PARAMS.QUICK_SELECT);

  return {
    fromDate,
    toDate,
    mode,
    quickSelect,
  };
}
