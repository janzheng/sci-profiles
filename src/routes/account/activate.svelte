<svelte:head>
  <title>Activate Account</title>
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
    <h1>Activate Account</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleActivateAccount}>

        <label htmlFor="password">Token
          <input
            type="password"
            id="password"
            name="password"
            bind:value={token}
          />
        </label>

        <button type="submit">Activate Account</button>
        {#if isLoading}
          <p>... signing up ...</p>
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


  const handleActivateAccount = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`/api/passport/activate/${token}`)
      isLoading = false

      if(response.status == 200) {
        const result = await response.json()
        // console.log('Account activation response:', result)
        logger('[handleActivateAccount]', 'Account activation response:', result)
        if(results.user)
          user = results.user
      }

    } catch (err) {
      error = err
      console.error(err)
      loggerror('[handleActivateAccount]', 'Error:', err)
      return
    }
  }
</script>






