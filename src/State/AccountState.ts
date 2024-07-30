import { LogInResponse } from './../Services/Accounts/Dtos/LogInResponse';
import { AccountClient } from "@/Services/AccountClient";
import { AuthCredential } from "@/Services/Accounts/AuthenticatedAccount/AuthCredential";
import { AuthToken } from "@/Services/Accounts/AuthenticatedAccount/AuthToken";
import { RefreshTokenRequest } from "@/Services/Accounts/Dtos/RefreshTokenRequest";
import { TokenType } from "@/Services/Accounts/AuthenticatedAccount/TokenType";
import { User } from "@/Services/Accounts/AuthenticatedAccount/User";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountState = defineStore("AccountState", () => {  

  //== Services ======================================================//
  const _client = new AccountClient();

  //== View-Model Variables ==========================================//
  const User = ref({
    username:fake(5),
    email:`${fake(5)}@chainmail.com`,
    firstName:fake(5),
    lastName:fake(5)
  } as User);
  const Auth = ref({} as AuthCredential);
  const IsLoggedIn = ref(User.value.guid != null);
  
  //== View-Model Methods ============================================//
  const LogIn = async (userName: string, password: string): Promise<boolean> => {
    console.log("AccountState.LogIn");

    const response = await _client.LogIn(userName, password)

    if(response != null){
      assignAccountValues(response);
    }
    return true;
  };
  
  const Register = async ( username: string, email: string, password: string, firstName: string, lastName: string ): Promise<boolean> => {

    const response = await _client.Register( username, email, password, firstName, lastName );

    if(response != null){
      assignAccountValues(response);
    }
    return true;
  };

  const assignAccountValues=( response: LogInResponse )=>{
    console.log("AccountState.Register: response...");
    console.dir(response);
    
    User.value = response.User;

    console.log(`response.AccessToken: ${response.AccessToken}.`)

    Auth.value = {
      accessToken: new AuthToken(TokenType.Access, response.AccessToken),
      refreshToken: new AuthToken(TokenType.Refresh, response.RefreshToken),
      authUserId: response.AuthUserId,
      // roles: response.Roles
    } as AuthCredential

    console.log(`Auth.AccessToken: ${Auth.value.accessToken.TryGetValidToken()}.`)

    IsLoggedIn.value = true;      
    console.log(`AccountState.IsLoggedIn: ${IsLoggedIn.value}...`);
    
  }

  const LogOut = async ()=>{
    User.value = {} as User;
    Auth.value = {} as AuthCredential;
    IsLoggedIn.value = false;
  };

  const GetToken = async ():Promise<string> =>{
    const isValid = Auth.value.accessToken.TryGetValidToken();
    if (isValid != ""){
      return isValid
    }
    refreshToken();
    return await GetToken();
    
  };

  //== Internal Methods ==============================================//
  const refreshToken = async ()=>{
    console.log("AccountState.RefreshToken");

    const refresher = Auth.value.refreshToken.TryGetValidToken();
    if(refresher != ""){
      const request = new RefreshTokenRequest(refresher);
      const response = await _client.RefreshToken(request)
      Auth.value.accessToken = response;
    }
  };

	function fake(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  return {
    User,
    Auth,
    IsLoggedIn,
    LogIn,
    Register,
    LogOut

  };
});
