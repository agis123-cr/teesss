async function loadUser(){

    const { data:{session} } = await supabaseClient.auth.getSession();


    if(!session){

        window.location.href="login.html";
        return;

    }


    const user = session.user;


    const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();



    if(error){

        console.log(error);
        return;

    }


    document.getElementById("userName").innerHTML =
    "Halo, " + data.nama + " 👋";


    document.getElementById("pointUser").innerHTML =
    data.poin;


}


loadUser();

// ===========================
// DARK MODE
// ===========================

const darkBtn = document.getElementById("darkMode");

if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

// ===========================
// MOBILE SIDEBAR
// ===========================

const mobileMenu = document.querySelector(".mobileMenu");
const sidebar = document.querySelector(".sidebar");

if (mobileMenu && sidebar) {

    mobileMenu.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

// ===========================
// PREVIEW FOTO
// ===========================

const photo = document.getElementById("photo");
const preview = document.getElementById("preview");

if (photo) {

    photo.addEventListener("change", function () {

        preview.innerHTML = "";

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            const img = document.createElement("img");

            img.src = e.target.result;

            preview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

}

// ===========================
// TOAST
// ===========================

function showToast(text){

const toast=document.getElementById("toast");

if(!toast) return;

toast.querySelector("span").innerHTML=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

// ===========================
// FORM
// ===========================

const reportForm = document.getElementById("reportForm");

if(reportForm){

reportForm.addEventListener("submit",(e)=>{

e.preventDefault();

showToast("Laporan berhasil dikirim.");

reportForm.reset();

preview.innerHTML="";

});

}

const map = L.map("reportMap").setView(
    [-6.1701,106.6403],
    15
);


L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:"© OpenStreetMap"
    }
).addTo(map);


let marker;


map.on("click",function(e){

    if(marker){
        map.removeLayer(marker);
    }


    marker = L.marker([
        e.latlng.lat,
        e.latlng.lng
    ]).addTo(map);


    document.getElementById("selectedLocation").innerHTML =
    `
    Latitude: ${e.latlng.lat}<br>
    Longitude: ${e.latlng.lng}
    `;

});

// ===========================
// LEADERBOARD
// ===========================

async function loadLeaderboard(){

    const { data, error } = await supabaseClient
    .from("profiles")
    .select("nama,poin,avatar")
    .order("poin",{ ascending:false })
    .limit(10);

    if(error){
        console.log(error);
        return;
    }

    const list = document.getElementById("leaderboardList");

    if(!list) return;

    list.innerHTML = "";

    data.forEach((user,index)=>{

        let medal = `${index+1}.`;

        if(index===0) medal="🥇";
        if(index===1) medal="🥈";
        if(index===2) medal="🥉";

        list.innerHTML += `
        <div class="leaderCard">

            <img src="${user.avatar || 'assets/avatar.png'}">

            <div>

                <h3>${medal} ${user.nama}</h3>

                <p>${user.poin} Point</p>

            </div>

        </div>
        `;

    });

}

loadLeaderboard();

// ===========================
// MOBILE MENU
// ===========================

// ===========================
// MOBILE MENU
// ===========================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");


if(menuToggle && navMenu){

    menuToggle.onclick = ()=>{

        navMenu.classList.toggle("show");

    };

}
