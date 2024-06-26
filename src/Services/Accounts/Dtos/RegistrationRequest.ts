export class RegistrationRequest{
  Username: string;
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  
  constructor(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    this.Username = username;
    this.Email = email;
    this.Password = password;
    this.FirstName = firstName;
    this.LastName = lastName;
  }

}
