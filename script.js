const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// let link = "https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b5196d49a478eb3f98a62d9a08e36c95&units=metric";
let currentTab = userTab;
let API_KEY = "537a6d5fe2035e26e3fbb2d5bc1cba9f";
currentTab.classList.add("current-tab")
getformsessionStorage();

function switchTab(clickedTab) { 
    if (clickedTab != currentTab) {
     currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")     
        }
        else{
                searchTab.classList.remove("active");
                userInfoContainer.classList.remove("active")
            searchForm.classList.remove("active")
                getformsessionStorage();

        }
    }
}


userTab.addEventListener("click" , ()=>{
// pass click tab as input
switchTab(userTab);

})

searchTab.addEventListener("click" , ()=>{
// pass click tab as input
switchTab(searchTab);
})

//                    readed


//if cordinet are present in session
function getformsessionStorage() {
const loaclCordinets = sessionStorage.getItem("user-Cordinets");
if(!loaclCordinets) {
    
grantAccessContainer.classList.add("active");

}

else{
const cordinet = JSON.parse(loaclCordinets)
fetchUserInfo(cordinet);
}
}

async function fetchUserInfo(Cordinets) {
    const {lat , lon} = Cordinets;
// make grant container Invisibale
grantAccessContainer.classList.remove("active")
loadingScreen.classList.add("active");


// API CALL For LOcation
try {
    const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data = await responce.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);

} catch (error) {
    console.log('error  is error' , error);
    loadingScreen.classList.remove("active");

}
}

function renderWeatherInfo(weatherInfo) {
    //featch the element  
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const weatherTemp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windspeed]")
    const cloudiness = document.querySelector("[data-cloudiness]")
    const humidity = document.querySelector("[data-humidity]")

    // fetch value 

   cityName.innerText =  weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;
   windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity} %`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
        
    }
    else{

alert("nothing")


    }
}

function showPosition(position) {
    
const userCordinets = {
lat : position.coords.latitude,
lon : position.coords.longitude

}

sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinets));
fetchUserInfo(userCordinets);
}

const Grantbtn = document.querySelector('[data-grantAccess]');
Grantbtn.addEventListener("click" , getlocation)


const searchInp = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) =>{
e.preventDefault();
 
let cityName = searchInp.value;

if (cityName === "") {
    return;
}
else{

    fetchWeatherSearchInfo(cityName);
}

})

async function fetchWeatherSearchInfo(city) {
    loadingScreen.classList.add('active')
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const respons = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =await  respons.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data);
    } catch (error) {
        
    }


}
