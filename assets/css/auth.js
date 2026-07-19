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



        const {data,error} =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });



        if(error){

            alert(error.message);

            return;

        }



        console.log("LOGIN:", data);


        alert("Login berhasil");


        window.location.href="index.html";


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
            alert("Password tidak sama!");
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
    alert(error.message);
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
    alert(profileError.message);
    return;
}


        alert("Pendaftaran berhasil!");

        window.location.href = "login.html";

    });

}