
<script>
	import marked from 'marked'
	import SocialBox from '../components/SocialBox.svelte'
	import { render } from '../_utils/markdownit.js'
	import { socialParse } from '../_utils/social-parse.js'

	export let Profile
	export let previewImage // generated from an uploaded image through file reader

	let name, email, siteTitle, profileImage, pitch, socialProfiles, cvContent
	
	$: name = Profile.fields['Name'] || 'Jane Doe'
	$: siteTitle = name || ''
	$: profileImage = Profile.fields['ProfileImage'] ? Profile.fields['ProfileImage'][0]['url'] : undefined
	$: pitch = Profile.fields['Pitch']
	$: email = Profile.fields['PublicEmail']



	// console.log('Profile.sv', Profile)

	$: if(Profile.fields['Title'])
		siteTitle = `${Profile.fields['Name']}, ${Profile.fields['Title']}`

  $: socialProfiles = socialParse(Profile.fields['Sidebar::Social'])

  $: cvContent = Profile.Notion ? Profile.Notion['content'] : Profile.fields['CV']

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
				{#if profileImage || previewImage}
					<img class="Profile-image" src={previewImage || profileImage} alt={`${name} profile image`}/>
				{/if}

				<h1 class="Profile-name">{siteTitle}</h1>
				{#if pitch}
					<div class="Profile-pitch">{@html render(pitch || '')}</div>
				{/if}
			</div>
			<SocialBox email={email} socialProfiles={socialProfiles} />
		</aside>

		<main class="Profile-main">
			{@html render(cvContent || '' )}
		</main>

	</article>

</div>



<style type="text/scss">



</style>







