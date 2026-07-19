async function loadProfile(){

    const {data:{session}} =
    await supabaseClient.auth.getSession();


    if(!session){

        window.location.href="login.html";
        return;

    }


    const user = session.user;



    const {data,error}=await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id",user.id)
    .single();



    if(error){

        console.log(error);
        return;

    }



    document.getElementById("nama").innerHTML =
    data.nama;


    document.getElementById("email").innerHTML =
    user.email;


    document.getElementById("phone").innerHTML =
    data.phone || "-";


    document.getElementById("poin").innerHTML =
    data.poin || 0;


    document.getElementById("role").innerHTML =
    data.role;

    if(data.role === "admin"){

    document.getElementById("adminBtn").style.display = "block";

}


    // tampilkan foto jika ada

    if(data.avatar){

        document.getElementById("profileImage").src =
        data.avatar;

    }


}




// =======================
// UPLOAD FOTO PROFIL
// =======================

const uploadButton =
document.getElementById("uploadAvatar");


if(uploadButton){


uploadButton.onclick = async()=>{


const avatarInput =
document.getElementById("avatarInput");


const file =
avatarInput.files[0];



if(!file){

alert("Pilih foto dulu");

return;

}



const {data:{session}} =
await supabaseClient.auth.getSession();


const user =
session.user;



const fileName =
user.id + "_" + Date.now() + "_" + file.name;


const {error:uploadError} =
await supabaseClient
.storage
.from("avatars")
.upload(
fileName,
file,
{
    cacheControl:"3600",
    upsert:true
}
);


if(uploadError){
    console.log(uploadError);
    alert(uploadError.message);
    return;
}



if(uploadError){

alert(uploadError.message);
return;

}




const urlData =
supabaseClient
.storage
.from("avatars")
.getPublicUrl(fileName);


const avatarURL = urlData.data.publicUrl;




const {error}=

await supabaseClient
.from("profiles")
.update({

avatar:avatarURL
})
.eq(
"id",
user.id
);



if(error){

alert(error.message);
return;

}



alert("Foto profil berhasil diubah");

location.reload();


}


}




async function logout(){

await supabaseClient.auth.signOut();

window.location.href="login.html";

}

document.getElementById("avatarInput")
.addEventListener("change",function(){

const file=this.files[0];

if(file){

const reader=new FileReader();

reader.onload=function(e){

document.getElementById("profileImage").src=e.target.result;

}

reader.readAsDataURL(file);

}

});


loadProfile();
