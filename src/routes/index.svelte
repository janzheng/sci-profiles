

<script>
	import Cytosis from 'cytosis';
	import RenderProfile from '../components/RenderProfile.svelte';

  import { getContext, onMount } from 'svelte';

  const Content$ = getContext('Content')
  $: Content = $Content$

  let intro
  $: intro = Cytosis.findField('intro', Content, 'Markdown')


  const Profile$ = getContext('Profile')
  $: Profile = $Profile$

  const Domain$ = getContext('Domain')
  $: Domain = $Domain$

  // $: console.log('index profile:', Profile)
</script>



<RenderProfile { Profile } />







<style>
</style>



