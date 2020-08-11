<svelte:head>
	<title>Profile</title>
</svelte:head>

<style>
  .login {
    max-width: 340px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  form {
    display: flex;
    flex-flow: column;
  }

  label {
    font-weight: 600;
  }

  input {
    padding: 8px;
    margin: 0.3rem 0 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    height: 60px;
  }

  .error {
    margin: 0.5rem 0 0;
    color: brown;
  }
</style>


<!-- <div class="_section-page _padding-top-2 _margin-center"> -->
<div class="_grid-2 _padding">
  <div class="_section-article _margin-center">
    <h1>Profile</h1>
    <p><a href={`/u/${Slug}`} target="_blank">View profile</a></p>


    <div class="_grid-2 _margin-bottom-2">
      <form on:submit|preventDefault={handleSaveProfile}>
        <button type="submit">Save Changes</button>
      </form>
      <form on:submit|preventDefault={handleLogout}>
        <button type="submit">Log Out</button>
      </form>
    </div>
    {#if hasChanged}
      <div class="_card _padding _margin-bottom-2">You've made changes! Don't forget to save!</div>
    {/if}

    <form id="profileForm">

      <label htmlFor="Title">Title
        <input
          type="text"
          id="Title"
          name="Title"
          bind:value={Title}
          on:input={triggerHasChanged}
        />
      </label>
      <label htmlFor="Name">Name
        <input
          type="text"
          id="Name"
          name="Name"
          bind:value={Name}
          on:input={triggerHasChanged}
        />
      </label>

      <label htmlFor="CustomSlug">Custom Slug
        <input
          type="email"
          id="CustomSlug"
          name="CustomSlug"
          bind:value={CustomSlug}
          on:input={triggerHasChanged}
        />
      </label>
      <div class="Slug _margin-bottom-2">
        Your slug is currently set as: { Slug }  
      </div>



      <label htmlFor="CustomSlug">Avatar URL
        <input
          type="text"
          id="AvatarURL"
          name="AvatarURL"
          bind:value={avatarUrl}
          on:input={triggerHasChanged}
        />
      </label>


      <label htmlFor="Files">Upload Avatar
        <input
          type="file"
          id="Files"
          name="Files"
          bind:files
          on:input={triggerHasChanged}
        />
        {#if files && files.length > 0}
          <div class="_padding _card _margin-bottom-2">{files[0].name}</div>
        {/if}
      </label>


      <label htmlFor="PublicEmail">Public Email
        <input
          type="email"
          id="PublicEmail"
          name="PublicEmail"
          bind:value={PublicEmail}
          on:input={triggerHasChanged}
        />
      </label>
      <label htmlFor="Pitch">Short Description (Pitch)
        <input
          type="text"
          id="Pitch"
          name="Pitch"
          bind:value={Pitch}
          on:input={triggerHasChanged}
        />
      </label>
      <label htmlFor="Social">Social (paste social media links here, we'll do the rest)
        <textarea
          type="text"
          id="Social"
          name="Social"
          rows=4
          bind:value={Social}
          on:input={triggerHasChanged}
        ></textarea>
        {#if socialProfiles}
          <div class="_card _padding">
            <SocialBox email={PublicEmail} socialProfiles={socialProfiles} />
          </div>
        {/if}
        <!-- add a social media preview here -->
      </label>
      <label htmlFor="CV">CV (paste in Markdown)
        <textarea
          type="text"
          id="CV"
          name="CV"
          rows=8
          bind:value={CV}
          on:input={triggerHasChanged}
        ></textarea>
        <!-- add a social media preview here -->
      </label>
    </form>



    <div class="_grid-2">
      <form on:submit|preventDefault={handleSaveProfile}>
        <button type="submit">Save Changes</button>
      </form>

      <form on:submit|preventDefault={handleLogout}>
        <button type="submit">Log Out</button>
      </form>
    </div>

    <!-- <textarea>{ JSON.stringify(user,undefined,4) }</textarea> -->

  </div>





  <!-- right pane -->
  <div class="Preview">
    <div class="_section-article _margin-center">
      {#if user}
        <RenderProfile Profile={ user['Profile'] }  previewImage={ previewImage }/>
      {:else}
        Loading profile ...
      {/if}
    </div>
  </div>

</div>
        




<script>
  import { goto, stores } from '@sapper/app';
  import { getContext, onMount, tick } from 'svelte';

  import { login } from '../_utils/auth/client-helpers';
  import { logger, logerror } from '../_utils/logger';
  import { getUser } from '../_utils/auth/get-user';
  import { fetchPost, fetchPostForm } from '../_utils/fetch-helpers';
  import { socialParse } from '../_utils/social-parse.js'
  import RenderProfile from '../components/RenderProfile.svelte';

  import SocialBox from '../components/SocialBox.svelte'

  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, token = '', user, files, avatarUrl
  let hasChanged = false


  $: if(files) {
    console.log('Files:', files, typeof files)
  }

  // for Profile preview
  const Profile$ = getContext('Profile')
  $: Profile = $Profile$

  async function triggerHasChanged() {
    await tick() // update on next tick
    hasChanged = true
  }

  // profile items
  let Name, PublicEmail, Social, Pitch, Title, CV, Slug, CustomSlug


  
  let socialProfiles // parsed social profiles
  let previewImage // generated preview image for user


  async function initData() {
    await tick()
    if (user && user['Profile']) {
      Name = user['Profile'].fields['Name']
      PublicEmail = user['Profile'].fields['PublicEmail']
      Social = user['Profile'].fields['Sidebar::Social']
      Pitch = user['Profile'].fields['Pitch']
      Title = user['Profile'].fields['Title']
      CV = user['Profile'].fields['CV']
      socialProfiles = socialParse(Social); socialProfiles=socialProfiles // reactive
      Slug = user['Profile'].fields['Slug']
      CustomSlug = user['Profile'].fields['Slug::Custom']

      // this is super annoying since it keeps uploading a new file
      // avatarUrl = user['Profile'].fields['ProfileImage'] ? user['Profile'].fields['ProfileImage'][0]['url'] : undefined 
    }
    user['Profile'] = user['Profile'] // reactive profile
    hasChanged = false
  }

  onMount(async () => {
  	user = await getUser()

  	if(!user)
  		goto('/login')

    initData()
  })


  // update social on update
  $: if(Social) {
    socialProfiles = socialParse(Social); socialProfiles=socialProfiles // reactive
  }

  $: if(CustomSlug) { // update the displayed slug if user enters a custom slug
    Slug = CustomSlug || Slug
  }

  $: if(files) { // generate preview image from the upload and send it to the profile render box
    if(files && files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage = e.target.result
      }
      reader.readAsDataURL(files[0])
    }
  }



  const uploadAvatar = async (recordId) => {
    fetchPostForm('/api/profile/avatar', {recordId, avatar: files[0]}, fetch)
  }





  const handleSaveProfile = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      recordId: user['Profile'].id,
      'Sidebar::Social': Social, 
      'Slug::Custom': CustomSlug, 
      'ProfileImage': avatarUrl,
      Name, PublicEmail, Pitch, Title, CV
    }

    try {
      const response = await fetchPost('/api/profile', data, fetch)
      isLoading = false

      if(response.status == 200) {
        const results = await response.json()
        logger('[handleSaveProfile]', 'Saved!', results)
        user['Profile'] = results
        initData()

        if(files && files.length > 0)
          uploadAvatar(user['Profile'].id)

        hasChanged = false
      }

    } catch (err) {
      error = err
      console.error(err)
      return
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    isLoading = true

    try {
      const response = await fetch(`/api/passport/logout`)
      logger('[handleLogout]', 'Logout response:', response)
      isLoading = false
      if(response.status == 200) {
        const results = await response.json()
        logger('[handleLogout]', 'Logged Out:', response)
        user = null
        goto('/')
      } else {
      }

    } catch (err) {
      error = err
      logerror('[handleLogout]', 'Error:', err)
      return
    }
  }



</script>












