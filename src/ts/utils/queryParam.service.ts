import { QUERY_PARAMS } from "./constants";

export const queryParamService = {
  set: {
    fromDate: (fromDate: string) => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.set(QUERY_PARAMS.FROM_DATE, fromDate);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    toDate: (toDate: string) => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.set(QUERY_PARAMS.TO_DATE, toDate);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    mode: (mode: "since" | "until") => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.set(QUERY_PARAMS.MODE, mode);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    quickSelect: (quickSelect: string) => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.set(QUERY_PARAMS.QUICK_SELECT, quickSelect);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
  },
  remove: {
    fromDate: () => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.delete(QUERY_PARAMS.FROM_DATE);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    toDate: () => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.delete(QUERY_PARAMS.TO_DATE);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    mode: () => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.delete(QUERY_PARAMS.MODE);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
    quickSelect: () => {
      const existingQueryParams = new URLSearchParams(window.location.search);
      existingQueryParams.delete(QUERY_PARAMS.QUICK_SELECT);
      const newUrl = `${
        window.location.pathname
      }?${existingQueryParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    },
  },
};
