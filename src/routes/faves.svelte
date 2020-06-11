<!-- <script context="module">
  export async function preload(page, session) {
    const cytosis = await this.fetch(`/api/cytosis`).then(r => r.json())
    // const Content = cytosis.results['Content']

    const Content = cytosis
    console.log('faves.svelte cytosis:', cytosis)
    return { Content };
  }
</script>
 -->

<script>

	// This trick passes down preloaded data to all modules
	// https://stackoverflow.com/questions/60911171/how-to-pass-data-from-a-layout-to-a-page-in-sapper
	// export let segment, 
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

	// export let Content
 //  const Content$ = writable(Content)
 //  $: $Content$ = Content
 //  setContext('Content', Content$)
 //  $: console.log('Content :::', Content$)



</script>










<h1 class="_margin-top-2">Great success!</h1>
