<script context="module">
  export async function preload(page, session) {
    const _result = await this.fetch(`/api/profile`).then(r => r.json())

    // console.log('api result:', _result)
    const Profile = _result 
    // const Content = _result['Content']
    // const Profiles = _result['Profiles'] 
    // const Domain = _result['Domain']
    // const Profile = _result['Profile'] // if given a domain, this is the single profile linked to that domain (e.g. jessica @ phage.ca)
    // return { Content, Profiles, Domain, Profile }
    return { Profile }
  }
</script>


<script>
	import Nav from '../components/Nav.svelte';
	import { goto, stores } from '@sapper/app';

	const { session } = stores();
	// export let segment, user;
  export let user;

	$: user = $session.user

	// This trick passes down preloaded data to all modules
	// https://stackoverflow.com/questions/60911171/how-to-pass-data-from-a-layout-to-a-page-in-sapper
	// export let segment, 
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  export let Profile
  const Profile$ = writable(Profile)
  $: $Profile$ = Profile
  setContext('Profile', Profile$)

	// export let Content, Profiles, Domain, Profile
 //  const Content$ = writable(Content)
 //  $: $Content$ = Content
 //  setContext('Content', Content$)

 //  const Profiles$ = writable(Profiles)
 //  $: $Profiles$ = Profiles
 //  setContext('Profiles', Profiles$)

 //  const Domain$ = writable(Domain)
 //  $: $Domain$ = Domain
 //  setContext('Domain', Domain$)

 //  const Profile$ = writable(Profile)
 //  $: $Profile$ = Profile
 //  setContext('Profile', Profile$)
</script>

<style type="text/scss">

	// main {
	// 	position: relative;
	// 	max-width: 56em;
	// 	background-color: white;
	// 	padding: 2em;
	// 	margin: 0 auto;
	// 	box-sizing: border-box;
	// }
</style>

<!-- Layout user: { user } -->
<!-- <Nav segment={segment} user={user} /> -->

<main>
	<slot user={user}></slot>
</main>


