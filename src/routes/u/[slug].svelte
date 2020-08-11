<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		// const res = await this.fetch(`api/profile?slug=${params.slug}`)
    const _result = await this.fetch(`api/profile?slug=${params.slug}`).then(r => r.json())

		if (_result) {
			return {profile: _result}
		}
	}
</script>


<div class="_section-content _card _padding _margin-center">
	<RenderProfile Profile={ profile } />
</div>


<div class="_padding _section-article _margin-center">
	<CommentBox locationId={locationId} />
</div>



<script>
	import Cytosis from 'cytosis';
	import RenderProfile from '../../components/RenderProfile.svelte'

  import { getContext, onMount } from 'svelte'
  import CommentBox from '../../components/CommentBox.svelte'

	export let profile

  let locationId

  onMount(async () => {
  	locationId = window.location.pathname;
	})
	
</script>



<style>
</style>



