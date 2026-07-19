// ===========================
// LOGIN
// ===========================

const form = document.getElementById("loginForm");

if (form) {

   form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    showMessage(
        "Sedang masuk...",
        "loading"
    );

    const { data, error } =
    await supabaseClient.auth.signInWithPassword({

        email: email,
        password: password

    });

    if(error){

        showMessage(
            error.message,
            "error"
        );

        return;
    }

    showMessage(
        "Login berhasil ✅",
        "success"
    );

    setTimeout(()=>{

        window.location.href = "index.html";

    },1000);

});



}

// ===========================
// REGISTER
// ===========================


const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirmPassword").value;


        if (password !== confirm) {
           showMessage("Password tidak sama!", "error");
return;
        }


        // Buat akun di Supabase Auth
       const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
        data: {
            nama: name
        }
    }
});

console.log("SIGNUP DATA:", data);
console.log("SIGNUP ERROR:", error);

if (error) {
    showMessage(error.message,"error");
return;
}


        // Simpan profil user
       const { error: profileError } = await supabaseClient
    .from("profiles")
    .insert({
        id: data.user.id,
        nama: name,
        phone: phone,
        poin: 0,
        role: "user"
    });

console.log("PROFILE ERROR:", profileError);

if (profileError) {
showMessage(profileError.message,"error");
return;
}


       showMessage("Pendaftaran berhasil! Silakan login.", "success");

setTimeout(()=>{

window.location.href="login.html";

},1500);

    });

}

function showMessage(text,type){

const msg=document.getElementById("message");

if(!msg) return;


msg.innerHTML=text;

msg.className=type;

msg.style.display="block";


}
