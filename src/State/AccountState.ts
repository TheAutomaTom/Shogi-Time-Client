import { AccountClient } from "@/Services/AccountClient";
import { AuthCredential } from "@/Services/Accounts/AuthenticatedAccount/AuthCredential";
import { RefreshTokenRequest } from "@/Services/Accounts/Dtos/RefreshTokenRequest";
import { User } from "@/Services/Accounts/AuthenticatedAccount/User";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountState = defineStore("AccountState", () => {  

  //== Services ======================================================//
  const _client = new AccountClient();

  //== View-Model Variables ==========================================//
  const User = ref({
    username:fake(5),
    email:`${fake(5)}@xmail.com`,
    firstName:fake(5),
    lastName:fake(5)
  } as User);

  const Auth = ref({} as AuthCredential);
  const IsLoggedIn = ref(User.value.guid != null);
  
  //== View-Model Methods ============================================//
  const LogIn = async (userName: string, password: string) => {
    console.log("AccountState.LogIn");

    const response = await _client.LogIn(userName, password)

    User.value = response.User;
    Auth.value = response.AuthCredential;
  };
  
  const Register = async ( username: string, email: string, password: string, firstName: string, lastName: string ) => {
    console.warn("AccountState.Register...");
    console.log(`username :${username}`);
    console.log(`email :${email}`);
    console.log(`password :${password}`);
    console.log(`firstName :${firstName}`);
    console.log(`lastName :${lastName}`);


    const attempt = await _client.Register( username, email, password, firstName, lastName );

    if(attempt != null){
      console.log("AccountState.Register: attempt...");
      console.dir(attempt);
      
      User.value = attempt.User;

      Auth.value = attempt.AuthCredential;




      console.log("attempt.AuthCredential:");
      console.dir(attempt.AuthCredential);

      IsLoggedIn.value = true;      
      console.log(`AccountState.IsLoggedIn: ${IsLoggedIn.value}...`);
    }
  };

  

  const LogOut = async ()=>{
    User.value = {} as User;
    Auth.value = {} as AuthCredential;
    IsLoggedIn.value = false;
  }

  const GetToken = async ():Promise<string> =>{
    const isValid = Auth.value.accessToken.TryGetValidToken();
    if (isValid != ""){
      return isValid
    }
    refreshToken();
    return await GetToken();
    
  }  
  
  //== Internal Methods ==============================================//
  const refreshToken = async ()=>{
    console.log("AccountState.RefreshToken");

    const refresher = Auth.value.refreshToken.TryGetValidToken();
    if(refresher != ""){
      const request = new RefreshTokenRequest(refresher);
      const response = await _client.RefreshToken(request)
      Auth.value.accessToken = response;
    }
  }

  
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
  }

  return {
    User,
    Auth,
    IsLoggedIn,
    LogIn,
    Register,
    LogOut

  };
});
