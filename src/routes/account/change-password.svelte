<script context="module">
  export async function preload(page, session) {
    const { token } = page.query;
    return { token };
  }
</script>

<svelte:head>
	<title>Change Password</title>
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
    <h1>Change Password</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleResetPassword}>
        <label htmlFor="token">Token
          <input
            type="text"
            id="token"
            name="token"
            bind:value={token}
          />
        </label>


        <label htmlFor="password">New Password
          <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
          />
        </label>

        <button type="submit">Change Password</button>
        {#if isLoading}
        	<p>... Changing password ...</p>
        {/if}

        {#if error}
        	<p className="error">{error}</p>
        {/if}

      </form>
    </div>
  </div>
</div>
        




<script>
  import { goto, stores } from '@sapper/app';
  import { login } from '../../_utils/auth/client-helpers';
  import { fetchPost } from '../../_utils/fetch-post';
  import { logger, logerror } from '../../_utils/logger';
  import { onMount } from 'svelte';

  export let token
  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, user


  const handleResetPassword = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      password, token
    }

    try {
      // const response = await fetch(
      // `/api/passport/reset`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // })
      const response = await fetchPost('/api/passport/reset', data, fetch)
      isLoading = false

      if(response.status == 200) {
        const result = await response.json()
        console.log('Reset Password result:', result)
        logger('[handleResetPassword]', 'Reset Password result:', result)
      }

    } catch (err) {
      error = err
      // console.error(err)
      logerror('[handleResetPassword]', 'Error:', err)
      return
    }
  }

</script>






