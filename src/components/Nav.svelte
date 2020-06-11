
<script>
	export let segment, user;
	import { goto, stores } from '@sapper/app';
	import { logout } from '../_utils/auth-helpers';

	const { session } = stores();

	const handleLogout = () => {
		logout(session).then((res) => {
			goto('/')
			user = null
	  })

	}
</script>





<style type="text/scss">
	// @import './styles/core.scss';

	.logout {
		height: 100%;
		cursor: pointer;
	}

	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
		display: grid;
		grid-template-columns: 1fr auto;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: usetheme(active) !important;
		display: block;
		bottom: -1px;
	}

	a, ._item {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	.right {
		justify-content: end;
	}
</style>

<!-- nav user: { user } -->


<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>home</a></li>
		<!-- <li><a class='{segment === "about" ? "selected" : ""}' href='about'>about</a></li> -->

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<!-- <li><a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>blog</a></li> -->
		<!-- <li><a rel=prefetch class='{segment === "faves" ? "selected" : ""}' href='faves'>faves</a></li> -->

	</ul>
	<ul class='right'>

		{#if !user}
			<li ><a class='{segment === "login" ? "selected" : ""}' href='login'>login</a></li>
			<li><a class='{segment === "signup" ? "selected" : ""}' href='signup'>signup</a></li>
		{:else}
			<li><a class='{segment === "profile" ? "selected" : ""}' href='profile'>profile</a></li>
			<li><span class="_item logout" on:click={handleLogout} >logout</span></li>
		{/if}
	</ul>
</nav>

