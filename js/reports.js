async function checkAI(file){

    // sementara simulasi AI

    let score = Math.floor(Math.random() * 40) + 60;

    return score;

}


function getAIResult(score){

    if(score >= 70){
        return "Sampah";
    }

    return "Bukan Sampah";

}

let latitude = null;
let longitude = null;


// MAP

const reportMap = L.map('reportMap').setView(
[-6.2,106.8],
13
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(reportMap);



let reportMarker;


function setLocation(lat,lng){

    latitude = lat;
    longitude = lng;


    if(reportMarker){
        reportMap.removeLayer(marker);
    }

reportMarker = L.marker([
    lat,
    lng
]).addTo(reportMap);



    document.getElementById(
    "selectedLocation"
    ).innerHTML =
    `
    Lokasi dipilih:
    <br>
    ${lat},
    ${lng}
    `;

}



// klik manual di map

reportMap.on("click",function(e){

    setLocation(
        e.latlng.lat,
        e.latlng.lng
    );

});




// tombol Gunakan Lokasi Saya

const locationBtn =
document.getElementById("getLocation");


if(locationBtn){


locationBtn.addEventListener("click",()=>{


    if(!navigator.geolocation){

        alert("GPS tidak tersedia");
        return;

    }


    locationBtn.innerHTML =
    "⏳ Mengambil lokasi...";



    navigator.geolocation.getCurrentPosition(

    function(position){


        const lat =
        position.coords.latitude;


        const lng =
        position.coords.longitude;



        reportMap.setView(
            [lat,lng],
            17
        );


        setLocation(
            lat,
            lng
        );


        locationBtn.innerHTML =
        "📍 Lokasi Berhasil";


    },


    function(){

        alert(
        "Gagal mengambil lokasi. Izinkan akses GPS."
        );


        locationBtn.innerHTML =
        "📍 Gunakan Lokasi Saya";

    }


    );


});


}




// SUBMIT


const form =
document.getElementById("reportForm");


form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const {data:{session}} =
await supabaseClient.auth.getSession();



if(!session){

alert("Silakan login dulu");
return;

}



const user =
session.user;



const file =
document.getElementById("photo").files[0];


const description =
document.getElementById("description").value;



if(!file || !latitude){

alert("Foto dan lokasi wajib diisi");

return;

}




// upload foto


const fileName =
Date.now()+"_"+file.name;



const { data, error: uploadError } = await supabaseClient.storage
  .from("report-images")
  .upload(fileName, file);

console.log("UPLOAD DATA:", data);
console.log("UPLOAD ERROR:", uploadError);

if (uploadError) {
  alert(uploadError.message);
  return;
}





const {data:urlData}=

supabaseClient.storage
.from("report-images")
.getPublicUrl(fileName);






// AI DETECTION

const aiScore = await checkAI(file);

const aiResult = getAIResult(aiScore);



const lokasi = `${latitude}, ${longitude}`;


const { error } = await supabaseClient
.from("reports")
.insert({

    user_id: user.id,

    foto: urlData.publicUrl,

    lokasi: lokasi,

    deskripsi: description,

    status: aiScore >= 70 
        ? "Diproses" 
        : "Ditolak",

    ai_score: aiScore,

    ai_result: aiResult

});




if (error) {
    console.log(error);
    alert(JSON.stringify(error));
    return;
}


alert(
"Laporan berhasil dikirim!"
);


window.location.href=
"history.html";


});
