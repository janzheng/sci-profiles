







<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1>Profile page</h1>

{#if isLoading}
	<p>... loading user data</p>
{/if}


{#if userId}
	your user id: { userId }

	<p>user data: { JSON.stringify(userData) }

	<div class="Formlet _padding-top-2" >
		<div class="_grid-2">
			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="name" class="_form-label">Your name</label>
				<input id="name" name="name" bind:value={name} placeholder="e.g. Jane H. Doe" required="required" type="text" class="_form-input __width-full"> 
			</div>

			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="email" class="_form-label">Your email</label>
				<input id="email" name="email" bind:value={email} placeholder="jane@phage.directory" required="required" type="email" class="_form-input __width-full"> 
			</div>
		</div>
<!-- 
		<div class="Formlet Formlet-input _padding-top _form-control _divider-bottom">
			<label for="topic" class="_form-label">Your presentation topic</label>
			<input id="topic" name="topic" bind:value={topic} placeholder="e.g. Phage manufacturing methods" required="required" type="text" class="_form-input __width-full"> 
		</div>
 -->
		<div class="_grid-2">
			<div>
				{#if registered}
					<div class="_padding-top">You're all signed up!</div>
				{/if}
			</div>
			<div class="_right">
				<input type="submit" value="Sign Up" class="_button __action  _margin-bottom-none" on:click|preventDefault={prereg}> 
			</div>
		</div>

	</div>
{/if}












<script>
	import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';

	const { session } = stores();
	import { getUserData, saveUserData } from '../_utils/user-helpers';


	let recordId, userId, userData, isLoading, error

	import marked from 'marked'

	let name='', email='', topic='', registered

  onMount(async () => {

	  try {
	  	isLoading = true
		  userData = await getUserData(session)
			console.log('userdata::: resp ::::', userData)

			userId = userData.id
			recordId = userData['content'].id
			name = userData['content'].fields['Name']
			email = userData['content'].fields['Email']
  		isLoading = false

	  } catch (err) {
	  	isLoading = false
	  	console.error('profile error or no access', err)
			goto('/login');
	  }
	})

	// $: console.log('session :::', $session)




const prereg = async () => {
	const data = {
		recordId,
		userId,
		name,
		email,
	}

	const res = await saveUserData(session, data)

	if(res.status == 200) {
		registered = true
		email = ''
		name = ''
	}
}

</script>




