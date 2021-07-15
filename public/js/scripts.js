window.onload = () => {
	document.getElementById("info").innerText = `Cargando...`;
	const fragment = new URLSearchParams(window.location.hash.slice(1));
	const [accessToken, tokenType] = [
		fragment.get("access_token"),
		fragment.get("token_type"),
	];

	if (!accessToken) {
		document.getElementById("info").innerText =
			"Bienvenido, inicia sesión para continuar:";

		return (document.getElementById("login").style.display = "block");
	}

	fetch("https://discord.com/api/users/@me", {
		headers: {
			authorization: `${tokenType} ${accessToken}`,
		},
	})
	.then((result) => result.json())
	.then((response) => {
		const user = response;
		console.log(user);
		document.getElementById("info").innerText = `Bienvenido, ${user.username}#${user.discriminator}`;
	})
	.catch(console.error);

};