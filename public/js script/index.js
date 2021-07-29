const signIn = document.getElementById("signin");
const logWin = document.getElementById("loginwindow");

signIn.onclick = () => { login() };
function login() {
    logWin.setAttribute("style","display: flex");
}

const cancelLogIn = document.getElementById("cancellogin");
console.log(cancelLogIn);
cancelLogIn.onclick = () => { cancelFun() };
function cancelFun() {
    logWin.setAttribute("style","display: none");
}

