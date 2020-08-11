<svelte:head>
	<title>Login</title>
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
    <h1>Log in</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleLogin}>

        <label htmlFor="email">Email
          <input
            type="text"
            id="email"
            name="email"
            bind:value={email}
          />
        </label>

        <label htmlFor="password">Password
          <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
          />
        </label>

        <button type="submit">Login</button>
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
  import { login } from '../_utils/auth/client-helpers';
  import { fetchPost } from '../_utils/fetch-helpers';
  import { logger, logerror } from '../_utils/logger';
  import { onMount } from 'svelte';
  import { getUser } from '../_utils/auth/get-user';

  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, token = '', user

  onMount(async () => {
    user = await getUser()
    if(user)
      goto('/profile')
  })



  const handleOauth = async (event, service='google') => {
    event.preventDefault()
    goto(`/auth/${service}`)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      email,
      password
    }

    try {
      const response = await fetchPost('/api/passport/login', data, fetch)
      isLoading = false

      if(response.status == 200) {
        const results = await response.json()
        if(results.user) {
          logger('[handleLogin]', 'LOGGED IN!:', results)
          user = results.user
          goto('/profile')
        } else {
          logger('[handleLogin]', 'NOT LOGGED IN!:', results)
        }
      }

    } catch (err) {
      error = err
      console.error(err)
      return
    }
  }

</script>






