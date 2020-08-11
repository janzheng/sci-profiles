<!-- 

	from tutorial: https://www.smashingmagazine.com/2020/06/static-sites-jamstack-apps-faunadb/

	Consolidated files since I hate component hell

 -->

<section className="section">
  <div className="container container--small">

		<section className="section">
      {#if comments}
				{#each comments.data as item}
					<div class="_card _padding">
						<div class="_grid-2 _align-vertically">
							<div class="">
								{#await getProfileByPhid(item._phid) then profile}
									{#if profile.fields['ProfileImage'] && profile.fields['ProfileImage'].length>0}
										<img class="ProfileImage" src={profile.fields['ProfileImage'][0]['thumbnails']['small']['url']} alt="profile image">
									{/if}
									<strong>{profile.fields['Name']}</strong>
								{/await}
							</div>
							<div class="_font-small _right">{ getPrettyDate(item.ts) }</div>
						</div>
						<p class="_padding-top">{item.comment}</p>
					</div>
				{/each}
			{/if}



    </section>

		<section class="Formlet _padding-top-2" >
			<!-- <div class="Formlet Formlet-input _form-control _divider-bottom">
				<label for="sigName" class="_form-label">Username</label>
				<input id="sigName" name="sigName" bind:value={sigName} required="required" type="text" class="_form-input __width-full"> 
			</div> -->

		  <div class="Formlet Formlet-textarea _form-control">

		    <label for="sigMessage" class="_form-label">Your comment
		    <textarea id="sigMessage"
		              ref="textarea"
		              name="sigMessage"
		              rows="4"
		              class="_form-input _block" 
		              type="text"
		              bind:value={comment}
		    />
			</div>
			<div>
				<input type="submit" value="Post a nice comment!" class="_button __outline __width-full __action _margin-bottom-none" on:click|preventDefault={postComment}> 
			</div>

			{#if errorMessage}
				<div class="_margin-top">
					{ errorMessage }
				</div>
			{/if}

		</section>

  </div>
</section>






















<script>

  import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';
  import { getUser } from '../_utils/auth/get-user';

  import { fetchPost } from '../_utils/fetch-helpers';
  import { logger, logerror } from '../_utils/logger';


  // can be url, id slug, to tie these messages to a permalink, thread, etc.
  // if none provided, this is just a "general" message thread
  export let locationId 

	let comments, comment, errorMessage
	let user, userData // userData used to id user on Fauna using _phid


  onMount(async () => {
  	user = await getUser()

  	// want this for private messages, but not for message boards or comments!
  	// if(!user) 
  	// 	goto('/login')


  	await loadComments()

  	userData = {
  		_phid: user._phid,
  		id: user.id,
  		fullName: user.fullName
  	}

  	console.log('users', user, comments)
  })

	// $: console.log('win loc', locationId)
	





	const getPrettyDate = (ts) => {
		const dateObj = new Date(ts / 1000);
		return `${dateObj.toLocaleString('default', {weekday: 'long'})}, ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()} at ${dateObj.toLocaleTimeString('default', {hour: '2-digit',minute: '2-digit', hour12: false})}`
	}

	const loadComments = async () => {
    comments = await fetch(`api/comments?locId=${locationId}`).then(r => r.json())
	} 

	const getProfileByPhid = async (_phid) => {
    const profile = await fetch(`api/profile?_phid=${_phid}`).then(r => r.json())
    console.log('phid profile:', profile)
    return profile
	} 

	const postComment = async () => {
		const data = {
			comment,
			locId: locationId
		}

		if(!comment) {
			errorMessage = "Please post a nice comment!"
		}

		try {

      const response = await fetchPost('/api/comments', data, fetch)
			// success
			if(response.status == 200) {
				const result = await response.json()
				console.log('comment added successfully:', result)
				loadComments() // reload messages, since no db stream
				comment = ''
			}

			// error
			if(response.status == 400) {
				error = 'Server error'
				// url = ''
				// isLoading = false
			}

		} catch(err) {
			console.error('signature post error:', err)
			// error = err.message
			// isLoading = false
		}
	}



</script>


<style type="text/scss">

	.ProfileImage {
		object-fit: cover;
		border-radius: 100%;
		width: 48px;
		height: 48px;
		vertical-align: middle;
		margin-right: 16px;
	}

</style>




