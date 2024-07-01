<script setup lang="ts">
import { useAppState } from '@/State/AppState';
import { ref } from 'vue';

const app$ = useAppState();

const validationErrors = ref([] as string[]);

const username = ref(app$.Account$.User.username);
const email = ref(app$.Account$.User.email);
const password = ref("Admin123!");
const passwordConfirmation = ref("Admin123!");
const firstName = ref(app$.Account$.User.firstName);
const lastName = ref(app$.Account$.User.lastName);

const showRegistrationForm = ref(false);

const LogIn = async () =>{
		console.log(`AccountModal.LogIn Start: {${username.value}}, {${password.value}}.`);
		
		app$.Layout$.IsLoading = true;
		await app$.Account$.LogIn(username.value, password.value);
		app$.Layout$.IsLoading = false;

	};

	const Register = async () =>{
		validationErrors.value = [];
		if(password.value != passwordConfirmation.value){
			validationErrors.value.push("Password does not match password confirmation.");
			return;
		}		

		console.log("AccountModal.Register Start.");
		app$.Layout$.IsLoading = true;
		await app$.Account$.Register(
			username.value,
			email.value,
			password.value,
			firstName.value,
			lastName.value
		);
		app$.Layout$.IsLoading = false;
	};
	
	const LogOut = () =>{
		console.log("AccountModal.LogOut Start.");
		app$.Account$.LogOut();
	};

	const closeModal=()=>{
		app$.Layout$.ModalIsOpen = false;
	}


</script>
<template>
	<div class="toolbox-drawer-wrapper">

<!--  -->
		<div class="modal-header">
				Account
			<div class="modal-header-right">
				<button 
					class="icon-button ghost-button header-button" 
					@click="closeModal()"
				>X</button>
			</div>
		</div>

<!-- modal-content -->
		<div class="modal-content">
			<div 
				v-if="app$.Account$.IsLoggedIn == false"
			>
			<!--  -->
			<div class="modal-input-div">
				<span class="modal-input-label">Username:</span>
				<input 
					v-model="username" 
					type="text" 
					placeholder="User Name" 
					class="modal-input"					
				/>
			</div>
			<!--  -->
			<div class="modal-input-div">
				<span class="modal-input-label">Password:</span>
				<input 
					v-model="password" 
					type="text" 
					placeholder="Password" 
					class="modal-input"
				/>
			</div>
			<!--  -->
			<div class="modal-input-div"
				v-if="showRegistrationForm"
			>
				<span class="modal-input-label">Confirm:</span>
				<input 
					v-model="passwordConfirmation" 
					type="text" 
					placeholder="Confirm Password" 
					class="modal-input"
				/>
			</div>
			<!--  -->
			<div class="modal-input-div"
				v-if="showRegistrationForm"
			>
				<span class="modal-input-label">Email:</span>
				<input 
					v-model="email" 
					type="text" 
					placeholder="Email Address" 
					class="modal-input"
				/>
			</div>
			<!--  -->
			<div class="modal-input-div"
				v-if="showRegistrationForm"
			>
				<span class="modal-input-label">First&nbsp;Name:</span>
				<input 
					v-model="firstName" 
					type="text" 
					placeholder="First Name" 
					class="modal-input"
				/>
			</div>
			<!--  -->
			<div class="modal-input-div"
				v-if="showRegistrationForm"
			>
				<span class="modal-input-label">Last&nbsp;Name:</span>
				<input 
					v-model="lastName" 
					type="text" 
					placeholder="Last Name" 
					class="modal-input"
				/>
			</div>
			<!-- Validation -->
			<div class="modal-input-div"
				v-if="validationErrors.length > 0"
			>
				<p v-for="e in validationErrors" style="color:orangered">{{e}}</p>
			</div>

<!-- Submit -->
 <div class="submit-buttons">
			<!-- Submit.LogIn -->
			<div
			 	v-if="showRegistrationForm == false"
			>
				<button
					class="drawer-button"
					@click="LogIn()"
				>
					Log in
				</button>
			</div>

			<!-- Submit.Register -->
			<div
			 	v-if="showRegistrationForm == true"
			>
				<button
					class="drawer-button"
					@click="Register()"
				>
					Register
				</button>
			</div>

			<!-- Toggle form -->
			<button
				class="drawer-button-alt"
				@click="showRegistrationForm = !showRegistrationForm;console.log(`showRegistrationForm: ${showRegistrationForm}`)"
			>			
				{{ showRegistrationForm == true ? "...or log in with current account" : "...or register new account"}}
			</button> 
		</div>
<!--  -->


		</div>
	

<!-- Account Info -->
		<div				
			v-if="app$.Account$.IsLoggedIn == true"  
			id="account-info-user-data"
		>
			<table>
				<tr>
					<td style="padding-right:2em;">Username:</td>
					<td>{{ app$.Account$.User.username }}</td>
				</tr>
				<tr>
					<td>Email:</td>
					<td>{{ app$.Account$.User.email }}</td>
				</tr>
				<tr>
					<td>Name:</td>
					<td>{{ app$.Account$.User.firstName }} {{ app$.Account$.User.lastName }}</td>
				</tr>
				<tr>
					<td>Role:</td>
					<td>{{ app$.Account$.User.userRole }}</td>
				</tr>
			</table>
			<button
				class="drawer-button"
				@click="LogOut()"
			>
				Log Out
			</button>
		</div>

	</div><!-- modal-content -->

	</div>
</template>

<style scoped lang="scss">
// Header
.modal-header{
  grid-row:2;
  grid-column:3;
  display: flex;
	margin: 0.75em;
  font-variant: small-caps;
}

.modal-header-right{
  width:100%;
  display: flex;
  flex-direction: row-reverse;
  align-items:center;	
}

.header-button{
	cursor: pointer;
}

// Content
.modal-content{
	margin:1em 2em;
}

.modal-input-div{
	display: flex;
}

.modal-input-label{
	margin-right: 0.5em;
	width:8em;
}
.modal-input{
	margin-bottom: 0.75em;
	width:100%;
}

.modal-input input{
	color: blue;
}

// drawer-button
// .submit-buttons{
// }

.drawer-button{
  font-size:x-large;
	width: 100%;
  border: none;
  color: white;
  background-color: inherit;
  padding-left:1.5em;
	margin: 0.5em 0em;
  cursor: pointer;
}

.drawer-button-alt{
  font-size:mediums;
	width: 100%;
	  border: none;
  color: white;
  background-color: inherit;
  padding-left:1.5em;
  cursor: pointer;
}
.drawer-button:hover{
  color: goldenrod;
  background-color: black;
}
.drawer-button:active{
  color: gold;
  background-color: black;
}
.drawer-button-disabled{
  display: flex;
  font-size:x-large;
  border: none;
  color: grey;
  width:100% ;
  background-color: inherit;
  padding-left:1.5em;
}

.drawer-button-alt:hover{
	color:gold;
}


</style>