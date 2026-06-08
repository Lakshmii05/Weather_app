async function getWeather() {

    const city = document.getElementById("city").value.trim();
    const result = document.getElementById("weatherResult");

    // Check empty input
    if (!city) {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    result.innerHTML = "<p>Loading...</p>";

    try {

        // Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = "<p>City not found.</p>";
            return;
        }

        // Prefer Indian city if available
        const place =
            geoData.results.find(
                item => item.country === "India"
            ) || geoData.results[0];

        const { latitude, longitude } = place;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        const weatherData = await weatherResponse.json();

        result.innerHTML = `
            <h2>${place.name}</h2>
            <p>${place.admin1 || ""}, ${place.country}</p>

            <p>🌡 Temperature: 
                ${weatherData.current.temperature_2m} °C
            </p>

            <p>💧 Humidity: 
                ${weatherData.current.relative_humidity_2m}%
            </p>

            <p>🌬 Wind Speed: 
                ${weatherData.current.wind_speed_10m} km/h
            </p>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <p>❌ Failed to fetch weather data.</p>
        `;
    }
}