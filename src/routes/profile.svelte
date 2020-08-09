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


<div class="_section-page _padding-top-2 _margin-center">
  <div class="_section-article _margin-center">
    <h1>Profile</h1>


    <div class="_grid-2 _margin-bottom-2">
      <form on:submit|preventDefault={handleSaveProfile}>
        <button type="submit">Save Changes</button>
      </form>

      <form on:submit|preventDefault={handleLogout}>
        <button type="submit">Log Out</button>
      </form>
    </div>

    <label htmlFor="Title">Title
      <input
        type="text"
        id="Title"
        name="Title"
        bind:value={Title}
      />
    </label>
    <label htmlFor="Name">Name
      <input
        type="text"
        id="Name"
        name="Name"
        bind:value={Name}
      />
    </label>
    <label htmlFor="PublicEmail">Public Email
      <input
        type="email"
        id="PublicEmail"
        name="PublicEmail"
        bind:value={PublicEmail}
      />
    </label>
    <label htmlFor="Pitch">Short Description (Pitch)
      <input
        type="text"
        id="Pitch"
        name="Pitch"
        bind:value={Pitch}
      />
    </label>
    <label htmlFor="Social">Social (paste social media links here, we'll do the rest)
      <textarea
        type="text"
        id="Social"
        name="Social"
        rows=4
        bind:value={Social}
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
      ></textarea>
      <!-- add a social media preview here -->
    </label>



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
</div>
        




<script>
  import { goto, stores } from '@sapper/app';
  import { login } from '../_utils/auth/client-helpers';
  import { logger, logerror } from '../_utils/logger';
  import { getUser } from '../_utils/auth/get-user';
  import { onMount } from 'svelte';
  import { fetchPost } from '../_utils/fetch-post';
  import { socialParse } from '../_utils/social-parse.js'

  import SocialBox from '../components/SocialBox.svelte'

  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, token = '', user


  // profile items
  let Name, PublicEmail, Social, Pitch, Title, CV

  // parsed social
  let socialProfiles


  function initData() {
    console.log('initting data with', user)
    if (user && user['Profile']) {
      Name = user['Profile'].fields['Name']
      PublicEmail = user['Profile'].fields['PublicEmail']
      Social = user['Profile'].fields['Sidebar::Social']
      Pitch = user['Profile'].fields['Pitch']
      Title = user['Profile'].fields['Title']
      CV = user['Profile'].fields['CV']
      socialProfiles = socialParse(Social); socialProfiles=socialProfiles // reactive
    }
  }


  onMount(async () => {
  	user = await getUser()

  	if(!user)
  		goto('/login')

    initData()
  })



  const handleSaveProfile = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      recordId: user['Profile'].id,
      'Sidebar::Social': Social, 
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
      loggerror('[handleLogout]', 'Error:', err)
      return
    }
  }



</script>












<!-- 

	Old fauna profile

<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1>Profile page</h1>

{#if isLoading}
	<p>... loading user data</p>
{/if}


{#if userId}
	your user id: { userId }

	<p>user data: { JSON.stringify(userData) }

	<div class="Formlet _padding-top-2" >
		<div class="_grid-2">
			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="name" class="_form-label">Your name</label>
				<input id="name" name="name" bind:value={name} placeholder="e.g. Jane H. Doe" required="required" type="text" class="_form-input __width-full"> 
			</div>

			<div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="email" class="_form-label">Your email</label>
				<input id="email" name="email" bind:value={email} placeholder="jane@phage.directory" required="required" type="email" class="_form-input __width-full"> 
			</div>
		</div>

		<div class="Formlet Formlet-input _padding-top _form-control _divider-bottom">
			<label for="topic" class="_form-label">Your presentation topic</label>
			<input id="topic" name="topic" bind:value={topic} placeholder="e.g. Phage manufacturing methods" required="required" type="text" class="_form-input __width-full"> 
		</div>

		<div class="_grid-2">
			<div>
				{#if registered}
					<div class="_padding-top">You're all signed up!</div>
				{/if}
			</div>
			<div class="_right">
				<input type="submit" value="Sign Up" class="_button __action  _margin-bottom-none" on:click|preventDefault={prereg}> 
			</div>
		</div>

	</div>
{/if}









<script>
	import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';

	const { session } = stores();
	import { getUserData, saveUserData } from '../_utils/user-helpers';


	let recordId, userId, userData, isLoading, error

	import marked from 'marked'

	let name='', email='', topic='', registered

  onMount(async () => {

	  try {
	  	isLoading = true
		  userData = await getUserData(session)
			console.log('userdata::: resp ::::', userData)

			userId = userData.id
			recordId = userData['content'].id
			name = userData['content'].fields['Name']
			email = userData['content'].fields['Email']
  		isLoading = false

	  } catch (err) {
	  	isLoading = false
	  	console.error('profile error or no access', err)
			goto('/login');
	  }
	})

	// $: console.log('session :::', $session)




const prereg = async () => {
	const data = {
		recordId,
		userId,
		name,
		email,
	}

	const res = await saveUserData(session, data)

	if(res.status == 200) {
		registered = true
		email = ''
		name = ''
	}
}

</script>


 -->




