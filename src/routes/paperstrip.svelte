







<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1>Paper strip</h1>












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
			let response = await fetch(`api/paperstrip`)
	  } catch (err) {
	  }
	})

	// $: console.log('session :::', $session)




</script>




