//DARK MODE
const darkBtn = document.getElementById("darkMode");

if (darkBtn) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

    });

}


// LOAD REPORT FROM SUPABASE



async function loadReports(){
const {data:{session}} =
await supabaseClient.auth.getSession();



if(!session){
window.location.href="../login.html";
return;
}




// ambil laporan

const {data:reports,error}=

await supabaseClient
.from("reports")
.select("*")
.order(
"created_at",
{
ascending:false
}
);



if(error){

console.log(error);
return;

}


const tbody =
document.getElementById("adminBody");
tbody.innerHTML="";
reports.forEach(item=>{
let badge="pending";
if(item.status==="Selesai"){
badge="success";}

if(item.status==="Ditolak"){
badge="reject";}

tbody.innerHTML += `
<tr>

<td>
<img src="${item.foto}" width="70">
</td>



<td>
${item.nama || "-"}
</td>



<td>

${item.lokasi || "-"}

</td>



<td>

<span class="status ${badge}">

${item.status}

</span>

</td>



<td>

${item.ai_score || 0}%

</td>



<td>


<button class="detailBtn">

Detail

</button>


<button onclick="updateStatus('${item.id}','${item.user_id}')">

✔

</button>


</td>



</tr>


`;

});



document.getElementById("adminTotal").innerHTML =
reports.length;


}




// ubah status

async function updateStatus(id,user_id){


// ubah status laporan

const {error}=

await supabaseClient
.from("reports")
.update({

status:"Selesai"

})
.eq(
"id",
id
);



if(error){

alert(error.message);
return;

}



// ambil poin user sekarang

const {data:user,error:userError}=

await supabaseClient
.from("profiles")
.select("poin")
.eq(
"id",
user_id
)
.single();



if(userError){

alert(userError.message);
return;

}



// tambah 20 poin

await supabaseClient
.from("profiles")
.update({

poin:user.poin + 20

})
.eq(
"id",
user_id
);



alert("Laporan selesai +20 poin");


loadReports();


}

loadReports();


loadReports();

// ======================================
// LOAD TABLE
// ======================================

const tbody = document.getElementById("adminBody");

function loadTable(data){

tbody.innerHTML = "";


data.forEach(item=>{


let badge="pending";


if(item.status==="Selesai"){
    badge="success";
}


if(item.status==="Ditolak"){
    badge="reject";
}



tbody.innerHTML += `

<tr>

<td>
<img src="${item.foto}" width="70">
</td>


<td>
${item.nama || "-"}
</td>


<td>
${item.lokasi || "-"}
</td>


<td>
<span class="status ${badge}">
${item.status}
</span>
</td>


<td>
${item.ai_score || 0}%
</td>


<td>

<button onclick="showDetail('${item.id}')">
Detail
</button>


<button onclick="updateStatus('${item.id}')">
✔
</button>


</td>


</tr>

`;

});


}

async function showDetail(id){

const {data,error}=await supabaseClient
.from("reports")
.select("*")
.eq("id",id)
.single();


if(error){
console.log(error);
return;
}



document.getElementById("detailImage").src=data.foto;

document.getElementById("detailName").innerHTML=
data.nama || "User";


document.getElementById("detailLocation").innerHTML=
data.lokasi;


document.getElementById("detailDescription").innerHTML=
data.deskripsi;


document.getElementById("detailStatus").innerHTML=
data.status;


document.getElementById("detailAI").innerHTML=
data.ai_score+"%";


document.getElementById("detailModal")
.classList.add("active");


}