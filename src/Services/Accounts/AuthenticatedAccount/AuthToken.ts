import { TokenType } from "./TokenType.ts"
export class AuthToken{
  
  private token: string = "";
  private expiry: Date;
  
  constructor( type: TokenType, token: string ) {
    this.token = token;
    this.expiry = this.setTokenExpiration(type);
  }

  private setTokenExpiration = (type: TokenType):Date=> {  

    const timeToLive = type as number
    const update = new Date().setMinutes(timeToLive);
    return new Date(update);
  };
  

  TryGetValidToken =(): string => {

    
    console.log(`expiry   : ${this.expiry}`);
    console.log(`new Date : ${new Date()}`);
    console.error(`Compare: ${this.expiry > new Date()}`);

    if(this.expiry > new Date()){
      console.error("return token!");
      return this.token;
      
    } else{
      console.error("return nill.");
      return "";
    }
  };

}