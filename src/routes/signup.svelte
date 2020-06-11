<svelte:head>
	<title>Signup</title>
</svelte:head>

<style>
  .signup {
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

<h1>Signup page</h1>



<!-- helpful for forms: https://www.nielsvandermolen.com/signup-form-html5-validation-svelte/ -->

<div className="signup">
  <form on:submit|preventDefault={handleSubmit}>
    <label htmlFor="email">Email</label>

    <input
      type="text"
      id="email"
      name="email"
      bind:value={email}
    />

    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      bind:value={password}
    />

    <button type="submit">Signup</button>
    {#if isLoading}
    	<p>... signing up! ...</p>
    {/if}

    {#if error}
    	<p className="error">{error}</p>
    {/if}

  </form>
</div>
      

<script>
	import { goto, stores } from '@sapper/app';
	import { signup } from '../_utils/auth-helpers';

	const { session } = stores();
	let email = 'userx@test.com', password = 'testtest', isLoading = false, error


	const handleSubmit = async (event) => {
	  event.preventDefault()

  	isLoading = true

	  try {
		  signup({email, password, session}).then((res) => {
				goto('/profile');
		  }).catch((err) => {
				error = "User already exists!"
				isLoading = false
		  })
	  } catch (err) {
	  	console.error(err)
	  	return
	  }
	}
</script>






