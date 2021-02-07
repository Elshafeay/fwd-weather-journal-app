/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = +d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

const apiKey = "52da2042cc7af8661072c3cc5004fa60";
const generateBtn = document.querySelector("#generate")

generateBtn.addEventListener('click', async () => {
    const zipCode = document.querySelector("#zip").value;
    const feelings = document.querySelector("#feelings").value;
    
    if(!zipCode){
        return alert("Please enter the zip code!")
    }
    if(!feelings){
        return alert("Please enter what you feel!")
    }

    doYourMagic(zipCode, feelings)
})


async function doYourMagic(zipCode, feelings){
    try {

        // Fetching the weather data from the api
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`);
        
        if(response.status === 404 || response.status === 400){
            return alert("Please enter valid zip code!");
        }

        const weatherData = await response.json();
        const temp = weatherData.main.temp;



        // Sending data to the server
        await fetch('/saveData', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: newDate,
                temp: temp,
                feelings: feelings
            })
        });



        // Fetching data from the server
        const serverData = await fetch('/getData', { credentials: "same-origin" });
        const data = await serverData.json();



        // Updating UI
        updatingUI(data);
    }
    catch(err){
        alert("Something Wrong happened! Please try again");
    }
} 

function updatingUI(data){
    document.querySelector("#date").textContent = `Date is: ${data.date}`
    document.querySelector("#temp").textContent = `Temp is: ${data.temp}`
    document.querySelector("#content").textContent = `Feeling is: ${data.feelings}`
}