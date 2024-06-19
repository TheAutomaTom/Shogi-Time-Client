
export class ApiClient {
  _baseUrl: string;
  _key: string;
  constructor() {
    this._baseUrl =
      import.meta.env.MODE === "development"
        ? import.meta.env.VITE_ST_API_LOCAL
        : import.meta.env.VITE_ST_API_WEB;

    this._key = import.meta.env.VITE_ST_API_KEY;
  }

  async get(url: string) {
    return await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "x-api-key": this._key,
      },
    });
  }

  // async Get___(req: RequestDto): Promise<Entity> {
  //   const res = await this.get(
  //     `${this._baseUrl}/CRUD/${req.domain}/${req.script}`
  //   );
  //   if (res.ok) {
  //     return (await res.json()) as Entity;
  //   } else {
  //     throw Error(res.statusText);
  //   }
  // }

  // async Post___(update: Entity) {
  //   const res = await fetch(`${this._baseUrl}/CRUD`, {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json", 
  //       "x-api-key": this._key,
  //     },
  //     body: JSON.stringify(update),
  //   });
  //   if (res.ok) {
  //     return (await res.json()) as Entity;
  //   } else {
  //     throw Error(res.statusText);
  //   }
  // }
  
}
