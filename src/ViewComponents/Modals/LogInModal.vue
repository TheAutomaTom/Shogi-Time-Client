<script setup lang="ts">
import { useAppState } from '@/State/AppState';
import { ref } from 'vue';

const app$ = useAppState();

const username = ref(app$.Account$.User.username);
const email = ref(app$.Account$.User.email);
const password = ref("Admin123!");
const passwordConfirmation = ref("Admin123!");
const firstName = ref(app$.Account$.User.firstName);
const lastName = ref(app$.Account$.User.lastName);

const showRegistrationForm = ref(false);

const LogIn = () =>{
		console.log(`AccountToolbox.LogIn Start: {${username.value}}, {${password.value}}.`);
		app$.Account$.LogIn(username.value, password.value);
	};

	const Register = () =>{
		console.log("AccountToolbox.Register Start.");
		app$.Account$.Register(
			username.value,
			email.value,
			password.value,
			firstName.value,
			lastName.value
		);
	};

</script>
<template>
	<div class="toolbox-drawer-wrapper">

<div class="drawer-title"> 
	Account
</div>

<div 
	v-if="app$.Account$.IsLoggedIn == false"
	id="account-credentials-form"
>
	<input 
		v-model="username" 
		type="text" 
		placeholder="User Name" 
		class="mb-4"
	/>

	<input
		v-model="password" 
		type="password"
		show-password-on="click"
		clearable 
		placeholder="Password"
		:maxlength="30"
		class="mb-4"
		
	/>

	<input
		v-if="showRegistrationForm == true"
		v-model="passwordConfirmation" 
		type="password"
		show-password-on="click"
		clearable 
		placeholder="Password"
		:maxlength="30"
		class="mb-4"          
	/>
	<input 
		v-if="showRegistrationForm == true"
		v-model="email" 
		type="text" 
		placeholder="Email" 
		class="mb-4"
	/>
	<input 
		v-if="showRegistrationForm == true"
		v-model="firstName" 
		type="text" 
		placeholder="First Name" 
		class="mb-4"
	/>
	<input 
		v-if="showRegistrationForm == true"
		v-model="lastName" 
		type="text" 
		placeholder="Last Name" 
		class="mb-4"
	/>
	<button
		v-if="showRegistrationForm == false"
		class="drawer-button"
		@click="LogIn()"
	>
		Log in
	</button>
	
	<button
		v-if="showRegistrationForm == true"
		class="drawer-button"
		@click="Register()"
	>
		Register
	</button>
	
	<button
		class="drawer-button-alt"
		@click="showRegistrationForm = !showRegistrationForm"
	>
		{{ showRegistrationForm == true ? "Log in with current account" : "Register new account"}}
	</button>

	<div id="account-info-empty">
		<p>Not currently logged in.</p>
	</div>

</div>

<div id="account-info">

	<div
		v-if="app$.Account$.IsLoggedIn == true"  
		id="account-info-user-data"
	>
		<table>
			<tr>
				<td class="pr-2">Username:</td>
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

	</div>
</div>

</div>
</template>