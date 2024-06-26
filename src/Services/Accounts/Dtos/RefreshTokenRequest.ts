export class RefreshTokenRequest{
  grant_type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  
  constructor(
    refresh_token: string
  ) {
    this.refresh_token = refresh_token;
    this.grant_type = "refresh_token";
    this.client_id = import.meta.env.VITE_AUTH_CLIENT_ID;
    this.client_secret = import.meta.env.VITE_AUTH_CLIENT_SECRET;
  }

}
