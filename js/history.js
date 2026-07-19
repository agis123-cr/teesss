async function loadHistory(){


const {data:{session}} =
await supabaseClient.auth.getSession();



if(!session){

window.location.href="login.html";

return;

}



const user =
session.user;



const {data,error}=

await supabaseClient
.from("reports")
.select("*")
.eq("user_id",user.id)
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




const container =
document.getElementById(
"historyList"
);



container.innerHTML="";



if(data.length===0){

container.innerHTML=
`
<div class="card">
Belum ada laporan
</div>
`;

return;

}




data.forEach(report=>{


container.innerHTML +=

`

<div class="historyCard">


<img src="${report.foto}">


<div>


<h3>
${report.deskripsi}
</h3>


<p>
📍 
${report.latitude},
${report.longitude}
</p>



<span class="status">
${report.status}
</span>


<p>
AI Score:
${report.ai_score}
</p>


</div>



</div>

`;

});


}


loadHistory();