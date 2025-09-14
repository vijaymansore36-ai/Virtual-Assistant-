let btn = document.querySelector("#btn")
let content = document.querySelector("#content")
let voice = document.querySelector("#voice")

let voices = []

function loadVoices() {
    voices = window.speechSynthesis.getVoices()
}
window.speechSynthesis.onvoiceschanged = loadVoices
loadVoices()

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text)
    text_speak.rate = 1
    text_speak.pitch = 1
    text_speak.volume = 1

    let selectedVoice = voices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("google uk english female")
    )
    if (selectedVoice) {
        text_speak.voice = selectedVoice
    }

    text_speak.lang = "en-GB"
    window.speechSynthesis.speak(text_speak)
}

function sayAndDisplay(text) {
    if (content) {
        content.innerText = text
    }
    speak(text)
}

function wishMe() {
    let hours = new Date().getHours()
    if (hours >= 0 && hours < 12) {
        speak("Good Morning sir")
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon sir")
    } else {
        speak("Good Evening sir")
    }
}

window.addEventListener('load', () => {
    wishMe()
})

let RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition

if (!RecognitionClass) {
    alert("Speech Recognition API is not supported in this browser.")
} else {
    recognition = new RecognitionClass()
    recognition.onresult = (event) => {
        let currentIndex = event.resultIndex
        let transcript = event.results[currentIndex][0].transcript
        content.innerText = transcript
        takeCommand(transcript.toLowerCase())
    }
}

btn.addEventListener("click", () => {
    if (recognition) recognition.start()
    btn.style.display = "none"
    voice.style.display = "block"
})

function takeCommand(message) {
    btn.style.display = "flex"
    voice.style.display = "none"
    message = message.toLowerCase()

    if (message.includes("hello") || message.includes("hey")) {
        sayAndDisplay("Hello, I am Alina. What can I help you with?")
    } else if (message.includes("who are you")) {
        sayAndDisplay("I am your virtual assistant, created by Vijay sir.")
    } else if (message.includes("youtube")) {
        sayAndDisplay("Opening YouTube...")
        window.open("https://youtube.com", "_blank")
    } else if (message.includes("google")) {
        sayAndDisplay("Opening Google...")
        window.open("https://google.com", "_blank")
    } else if (message.includes("instagram")) {
        sayAndDisplay("Opening Instagram...")
        window.open("https://instagram.com", "_blank")
    } else if (message.includes("whatsapp")) {
        sayAndDisplay("Opening WhatsApp Web...")
        window.open("https://web.whatsapp.com", "_blank")
    } else if (message.includes("calculator")) {
        sayAndDisplay("Opening Calculator...")
        window.open("https://www.online-calculator.com/full-screen-calculator/", "_blank")
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        sayAndDisplay(`The time is ${time}`)
    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        sayAndDisplay(`Today's date is ${date}`)
    } else if (message.includes("joke")) {
        let jokes = [
            "Why don't programmers like nature? It has too many bugs.",
            "Why do Java developers wear glasses? Because they don’t see sharp.",
            "Why was the computer cold? Because it left its Windows open."
        ]
        let randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
        sayAndDisplay(randomJoke)
    } else if (message.includes("stop")) {
        window.speechSynthesis.cancel()
        sayAndDisplay("Okay, stopping voice output.")
    } else if (message.includes("weather in")) {
        let city = message.split("weather in")[1]?.trim()
        if (city && city.length > 0) {
            getWeather(city)
        } else {
            sayAndDisplay("Please tell me the city name after saying weather in.")
        }
    } else if (message.includes("weather")) {
        sayAndDisplay("Please say weather in followed by the city name, for example: weather in Delhi")

    // ✅ NEW FEATURES
    } else if (message.includes("play music")) {
        sayAndDisplay("Playing some music for you...")
        window.open("https://open.spotify.com/", "_blank")
    } else if (message.includes("news")) {
        sayAndDisplay("Fetching the latest news...")
        window.open("https://news.google.com/", "_blank")
    } else if (message.includes("wikipedia")) {
        let query = message.replace("wikipedia", "").trim()
        if (query) {
            sayAndDisplay(`Searching Wikipedia for ${query}`)
            window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`, "_blank")
        } else {
            sayAndDisplay("Please say something after Wikipedia.")
        }

    } else {
        if (message && message.trim() !== "") {
            sayAndDisplay(`This is what I found on the internet regarding ${message}`)
            window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank")
        }
    }
}

async function getWeather(city) {
    let apiKey = "fb9a5a4c58ee602ad5c556cc7522f47d"
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`

    try {
        let response = await fetch(url)
        let data = await response.json()
        if (data.cod === 200) {
            let temp = data.main.temp
            let desc = data.weather[0].description
            sayAndDisplay(`The weather in ${city} is ${temp} degrees Celsius with ${desc}`)
        } else {
            sayAndDisplay("Sorry, I could not find the weather for that city.")
        }
    } catch (error) {
        sayAndDisplay("Sorry, there was an error fetching the weather.")
    }
}
