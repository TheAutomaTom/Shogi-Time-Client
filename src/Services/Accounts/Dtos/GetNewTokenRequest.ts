export class GetNewTokenRequest{
  grant_type: string;
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  
  constructor(
    username: string,
    password: string
  ) {
    this.username = username;
    this.password = password;
    this.grant_type = "password";
    this.client_id = import.meta.env.VITE_AUTH_CLIENT_ID;
    this.client_secret = import.meta.env.VITE_AUTH_CLIENT_SECRET;
  }

}
