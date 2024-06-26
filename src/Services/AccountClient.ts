import { AuthToken } from "./Accounts/AuthenticatedAccount/AuthToken";
import { AuthenticatedAccount } from "./Accounts/AuthenticatedAccount/AuthenticatedAccount";
import { RefreshTokenRequest } from "./Accounts/Dtos/RefreshTokenRequest";

export class AccountClient{
  
  apiUrl = import.meta.env.VITE_GAME_API_URL;
  apiKey  = import.meta.env.VITE_GAME_API_KEY;
  authUrl = import.meta.env.VITE_AUTH_URL;
  authClient = import.meta.env.VITE_AUTH_CLIENT_ID;
  authSecret = import.meta.env.VITE_AUTH_CLIENT_SECRET;
  
  constructor() {
    this.apiUrl
      .replace("{ADDRESS}", import.meta.env.VITE_GAME_API_ADDRESS)
      .replace("{PORT}", import.meta.env.VITE_GAME_API_PORT)
      .replace("{VERSION}", import.meta.env.VITE_GAME_API_VERSION);

    this.authUrl
      .replace("{ADDRESS}", import.meta.env.VITE_AUTH_API_ADDRESS)
      .replace("{PORT}", import.meta.env.VITE_AUTH_API_PORT)
      .replace("{REALM}", import.meta.env.VITE_AUTH_REALM);
  }

  // GetNewToken(request: GetNewTokenRequest): Promise<AuthToken> {
  //   console.log("AccountClient.GetNewToken...");
  //   console.dir(request);
  //   throw new Error("Method not implemented.");
  // }

  RefreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
    console.log("AccountClient.RefreshToken...");
    console.dir(request);
    throw new Error("Method not implemented.");
  }

  async LogIn(username: string, password: string): Promise<AuthenticatedAccount> {
    console.log(`AccountClient.LogIn: username: ${username}, password: ${password}.`);
    
    const res = await fetch(`${this.apiUrl}/accounts/log-in`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json", 
        // TODO: implement on backend
        "x-api-key": this.apiKey 
      },
      body: JSON.stringify({
        username, 
        password
      })
    });

    console.log(`AccountClient.LogIn: Response.ok? ${res.ok}.`); 
    if (res.ok) {
      
      const asPascalCase = convertToPascalObjectKey(await res.json());
      const result = (asPascalCase) as AuthenticatedAccount;
      return result;

    } else {
      throw Error(res.statusText);
    }
    

  }

  async Register(username: string, firstName: string, lastName: string, email: string, password: string): Promise<AuthenticatedAccount> {

    const res = await fetch(`${this.apiUrl}/accounts/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json", 
        // TODO: implement on backend
        "x-api-key": this.apiKey 
      },
      body: JSON.stringify({
        username,
        password,
        email,
        firstName,
        lastName,
        role: "Registered"
      })
    });

    if (res.ok) {
      console.log(`AccountClient.Register: ${res}`);
      console.dir(res);

      const asPascalCase = convertToPascalObjectKey(await res.json());
      return (asPascalCase) as AuthenticatedAccount;
      
    } else {
      throw Error(res.statusText);
    }
    
  }





  
}


  
const convertToPascalObjectKey = (obj: object) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    return { ...acc, [pascalCaseKey]: value };
  }, {});
};
