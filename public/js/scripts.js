window.onload = () => {
	const fragment = new URLSearchParams(window.location.hash.slice(1));
	const [accessToken, tokenType] = [
		fragment.get("access_token"),
		fragment.get("token_type"),
	];

	if (!accessToken) {
		document.getElementById("user-welcome-text").innerText = "Bienvenido, inicia sesión para continuar:";

		return (document.getElementById("login-button").style.display = "block");
	}

	document.getElementById("main").innerHTML += `<div id="load_container"><div id="load"></div></div>`;
	
	fetch("https://discord.com/api/users/@me", {
		headers: {
			authorization: `${tokenType} ${accessToken}`,
			/* "Access-Control-Allow-Origin": "*" */
		},
	})
	.then((result) => result.json())
	.then((response) => {
		const user = response;
		
		let welcomeDiv = document.getElementById("user-welcome");
		let welcomeText = document.getElementById("user-welcome-text");

		welcomeText.innerText = `Bienvenido, ${user.username}#${user.discriminator}`;
		welcomeDiv.innerHTML += `<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif" alt="${user.username}'s Avatar">`;

		let mainContainer = document.getElementById('main');
		let loader = document.getElementById('load_container');
		mainContainer.removeChild(loader);

	})
	.catch((error) => {
		document.getElementById("user-welcome-text").innerText = `Ocurrió un error, intente de nuevo más tarde...`;
		
		let mainContainer = document.getElementById('main');
		let loader = document.getElementById('load_container');
		mainContainer.removeChild(loader);

		console.log(error.message);
	});

};