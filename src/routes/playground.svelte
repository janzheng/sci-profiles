
<svelte:head>
	<title>Sapper project playground</title>
</svelte:head>

<script>
  import marked from 'marked'
	import Cytosis from 'cytosis';



	// Content$ is a context object; $Content$ is a reactive context object
	import { getContext } from 'svelte';
  const Content$ = getContext('Content') 

  let intro
  // $: $Content$ = Content$ // create reactive store if required
  $: if(Content$) {
  	intro = Cytosis.findField('intro', $Content$, 'Markdown')
  }

</script>





<h1>Playground Page!</h1>

<p>Use this page to try out new stuff</p>


<figure>
	<img alt='Borat' src='great-success.png'>
	<figcaption>HIGH FIVE!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>


<h3>This is from Airtable</h3>
<p>{@html marked(intro)}</p>

 











<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
