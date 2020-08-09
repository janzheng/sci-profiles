<svelte:head>
	<title>Forgot Password</title>
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
    <h1>Forgot Password</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleForgot}>
        <label htmlFor="token">Email
          <input
            type="text"
            id="email"
            name="email"
            bind:value={email}
          />
        </label>


        <button type="submit">Send Password Reset</button>
        {#if isLoading}
        	<p>... Sending password reset ...</p>
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

  let email = 'janeazy@gmail.com', password = 'testtest', isLoading = false, error, token = '', user

  let forgotText
  const handleForgot = async (event) => {
    event.preventDefault()
    isLoading = true

    const data = {
      email,
    }

    try {
      // const response = await fetch(
      // `/api/passport/forgot`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // })
      const response = await fetchPost('/api/passport/forgot', data, fetch)
      isLoading = false

      if(response.status == 200) {
        forgotText = await response.json()
        // console.log('Forgot:', forgotText)
        logger('[handleForgot]', 'Forgot:', forgotText)
      }

    } catch (err) {
      error = err
      // console.error(err)
      loggerror('[handleForgot]', 'Error:', err)
      return
    }
  }


</script>






