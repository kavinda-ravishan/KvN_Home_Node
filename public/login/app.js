const loginDom = document.getElementById("login");
const emailDom = document.getElementById("email");
const passwordDom = document.getElementById("password");
const resDom = document.getElementById("res");

loginDom.addEventListener("click", async () => {
  resDom.classList.remove("resSuccess");
  resDom.classList.remove("resFailure");
  resDom.textContent = "";

  const userData = {
    email: emailDom.value,
    password: passwordDom.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  const res = await fetch("/login", options);

  if (res.status !== 200) {
    resDom.classList.add("resFailure");
    resDom.textContent = res.headers.get("error");
  } else {
    const resJson = await res.json();
    resDom.classList.add("resSuccess");
    resDom.textContent = resJson.msg;

    const resNext = await fetch("/dashboard");
    window.location.replace(resNext.url);
  }
});
