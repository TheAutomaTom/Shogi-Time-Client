import { TokenType } from "./TokenType.ts"
export class AuthToken{
  
  private token: string = "";
  private expiry: Date;
  
  constructor( type: TokenType, token: string ) {
    this.token = token;
    this.expiry = this.setTokenExpiration(type);
  }

  TryGetValidToken =(): string => {
    if(this.expiry > new Date()){
      return this.token;
    } else{
      return "";
    }
  };

  private setTokenExpiration = (type: TokenType):Date=> {    
    const timeToLive = type
    const update = new Date().setMinutes(timeToLive as number);
    return new Date(update);
  };

}