async function loadDashboard(){

const {data:{session}} =
await supabaseClient.auth.getSession();


if(!session){

window.location.href="login.html";
return;

}


const user = session.user;



// ambil profile

const {data:profile,error} =
await supabaseClient
.from("profiles")
.select("*")
.eq("id",user.id)
.single();



if(error){

console.log(error);
return;

}



document.getElementById("userName").innerHTML =
profile.nama;


document.getElementById("userPoint").innerHTML =
profile.poin;



// ambil laporan

const {data:reports} =
await supabaseClient
.from("reports")
.select("*")
.eq("user_id",user.id);



if(reports){


document.getElementById("totalReport").innerHTML =
reports.length;



document.getElementById("processReport").innerHTML =
reports.filter(
r=>r.status=="Diproses"
).length;



document.getElementById("doneReport").innerHTML =
reports.filter(
r=>r.status=="Selesai"
).length;


}


}


loadDashboard();