
<script>
	import marked from 'marked'
	import SocialBox from '../components/SocialBox.svelte'
	import { render } from '../_utils/markdownit.js'
	import { socialParse } from '../_utils/social-parse.js'

	export let Profile

	let name = Profile.fields['Name']
	let siteTitle = name
	let profileImage = Profile.fields['ProfileImage'][0]['url']
	let pitch = Profile.fields['Pitch']
	let email = Profile.fields['PublicEmail']

	// console.log('Profile.sv', Profile)

	$: if(Profile.fields['Title'])
		siteTitle = `${Profile.fields['Name']}, ${Profile.fields['Title']}`

  const socialProfiles = socialParse(Profile.fields['Sidebar::Social'])

  const cvContent = Profile.Notion ? Profile.Notion['content'] : Profile.fields['CV']

  // $: console.log('socialSidebar:', socialProfiles)
</script>



<svelte:head>
	<title>{siteTitle}</title>
	<link rel="icon" sizes="192x192" href={profileImage}>
  <meta property="og:image" content={profileImage} > 
  <meta name="twitter:image" content={profileImage} >
  <link rel="icon" type="image/png" sizes="192x192" href={profileImage}>
</svelte:head>


<div class="Profile">

	<!-- <header class="Profile-header"></header> -->

	<article class="Profile-article _grid-2-3 _grid-gap-large _grid-xs-block">
		<aside class="Profile-aside ">
			<div class="Profile-aside--slot _pinned-sm _padding-2-sm _padding-top-2-i _padding-bottom-i">
				{#if profileImage}
					<img class="Profile-image" src={profileImage} alt={`${name} profile image`}/>
				{/if}

				<h1 class="Profile-name">{siteTitle}</h1>
				{#if pitch}
					<div class="Profile-pitch">{@html render(pitch)}</div>
				{/if}
			</div>
			<SocialBox email={email} socialProfiles={socialProfiles} />
		</aside>

		<main class="Profile-main">
			{@html render(cvContent)}
		</main>

	</article>

</div>



<style type="text/scss">



</style>







