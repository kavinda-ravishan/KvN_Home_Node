const signupDom = document.getElementById("signup");
const emailDom = document.getElementById("email");
const userNameDom = document.getElementById("userName");
const passwordDom = document.getElementById("password");
const confirmPasswordDom = document.getElementById("confirmPassword");
const resDom = document.getElementById("res");

signupDom.addEventListener("click", async () => {
  resDom.textContent = "";

  const userData = {
    email: emailDom.value,
    userName: userNameDom.value,
    password: passwordDom.value,
    confirmPassword: confirmPasswordDom.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  const res = await fetch("/signup", options);

  if (res.status !== 200) {
    resDom.textContent = res.headers.get("error");
  } else {
    const resJson = await res.json();
    resDom.textContent = resJson.msg;
  }
});
