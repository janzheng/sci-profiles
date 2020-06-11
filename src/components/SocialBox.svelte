
<script>

	export let email, socialProfiles

	const socials = Array.from(socialProfiles)
</script>


<div class="SocialBox">

	{#if email}
		<div class="Email">
			<i class="_font-phage icon-mail"/>
			<a href={`mailto:${email}`} alt={email}>{ email }</a></div>
	{/if}

	{#each socials as social}
		<div class={social.type}>
			<i class={`_font-phage icon-${social.type}`}/>
			<a href={social.url} alt={social.type}>{ social.username }</a> <!-- {social.type} -->
		</div>
	{/each}

</div>


<style type="text/scss">

	a {
		text-decoration: none;
	}
</style>