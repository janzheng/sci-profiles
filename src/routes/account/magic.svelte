<script context="module">
  export async function preload(page, session) {
    const { token } = page.query;
    return { token };
  }
</script>


<svelte:head>
  <title>Magic Login</title>
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
    <h1>Magic Login</h1>

    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleSignup}>
        <label htmlFor="token">Token
          <input
            type="text"
            id="token"
            name="token"
            bind:value={token}
          />

        </label>

        <button type="submit">Log in</button>
        {#if isLoading}
          <p>... logging in ...</p>
        {/if}

        {#if error}
          <p className="error">{error}</p>
        {/if}

      </form>
      <div class="_margin-top">
        <form on:submit|preventDefault={(evt)=>handleOauth(evt,'twitter')}>
          <button type="submit">Log in with Twitter</button>
        </form>
      </div>
    </div>
  </div>
</div>
        




<script>
  import { goto, stores } from '@sapper/app';
  import { login } from '../../_utils/auth/client-helpers';
  import { fetchPost } from '../../_utils/fetch-helpers';
  import { logger, logerror } from '../../_utils/logger';
  import { onMount } from 'svelte';

  export let token
  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, user


  $: if (token) {
    // auto sign in?
    logger('[onStart]', 'Token exists, auto log in?', token)
  }

  // don't auto-login using onMount for Magic page in case another user 
  // is trying to log in
  // onMount(async () => {

  //   try {
  //     const response = await fetch(`api/passport/login`)
  //     // console.log('onMount response:', response)
  //     if(response.status == 200) {
  //       const results = await response.json()
  //       logger('[onMount]', 'Logged in:', results)
  //       if(results.user)
  //         user = results.user
  //     } else {
  //       // error = err
  //       logger('[onMount]', 'Error:', results)
  //       // goto('/passport');
  //     }
  //   } catch (err) {
  //     error = err
  //     console.error(err)
  //     logerror('[onMount]', 'Error:', err)
  //     return
  //   }
  // })



  const handleOauth = async (event, service='google') => {
    event.preventDefault()
    goto(`/auth/${service}`)
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      email,
      password
    }

    try {
      // const response = await fetch(
      // `/api/passport/signup`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // })

      const response = await fetchPost('/api/passport/signup', data, fetch)
      isLoading = false
      if(response.status == 200) {
        const results = await response.json()
        logger('[handleSignup]', 'Signed up:', results)
        if(results.user)
          user = results.user
      }

    } catch (err) {
      error = err
      // console.error(err)
      logerror('[handleSignup]', 'Error:', err)
      return
    }
  }
</script>






