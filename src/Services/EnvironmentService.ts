import { indexOf } from "lodash";

export class EnvironmentService {
  private getApiUrl(): string {
    if (
      import.meta.env.MODE === "development" &&
      import.meta.env.VITE_ST_TESTURL
    ) {
      console.error(
        "DEV MODE TEST URL SPEC'D: Url (" +
          import.meta.env.VITE_ST_TESTURL +
          ") is being pulled from .env"
      );
      return import.meta.env.VITE_ST_TESTURL;
    }
    return window.location.hostname;
  }

  GetDomain() {
    const url = this.getApiUrl();
    const indexOfDelimiter = url.indexOf(".");
    const domain = url.slice(0, indexOfDelimiter);
    return domain;
  }
}
