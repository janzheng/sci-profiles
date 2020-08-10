
<!-- mostly to demo the log out code -->

<svelte:head>
	<title>Logout</title>
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
    <h1>Log out</h1>



    <!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

    <div className="login">
      <form on:submit|preventDefault={handleLogout}>
        <button type="submit">Log Out</button>
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
      } else {
      }

      goto('/')

    } catch (err) {
      error = err
      logerror('[handleLogout]', 'Error:', err)
      return
    }
  }


</script>






