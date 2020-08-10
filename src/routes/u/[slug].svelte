<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		// const res = await this.fetch(`api/profile?slug=${params.slug}`)
    const _result = await this.fetch(`api/profile?slug=${params.slug}`).then(r => r.json())
		// const data = await res.json();

		if (_result) {
			return {profile: _result}
		}
	}
</script>

<RenderProfile Profile={ profile } />


<script>
	import Cytosis from 'cytosis';
	import RenderProfile from '../../components/RenderProfile.svelte';

  import { getContext, onMount } from 'svelte';

	export let profile;
</script>



<style>
</style>



