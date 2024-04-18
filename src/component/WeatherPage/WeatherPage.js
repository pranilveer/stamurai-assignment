import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./WeatherPage.module.css"

const WeatherPage = () => {
    const { cityName } = useParams();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = 'c1f5187177a454880933789a73a4fc02'; // Replace 'YOUR_API_KEY' with your actual API key

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchWeatherData();
    }, [cityName, apiKey]); // Ensure apiKey is included in dependencies array

    const kelvinToCelsius = kelvin => kelvin - 273.15;

    useEffect(() => {
        if (!weatherData) return;
    
        // Update background image based on weather description
        const container = document.querySelector(`.${styles.weather_container}`);
        if (container) {
            container.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weatherData.weather[0].description}')`;
        }
    
        // Update weather icon
        const icon = weatherData.weather[0].icon;
        const iconImg = document.querySelector(".icon");
        if (iconImg) {
            iconImg.src = `https://openweathermap.org/img/wn/${icon}.png`;
            iconImg.alt = weatherData.weather[0].description;
        }
    }, [weatherData]);
    

    return (
        <div className={styles.weather_container}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                weatherData && (
                    <div className={styles.card}>
                        <div className={styles.weather}>
                        <h2>Weather in {cityName}</h2>
                            <h1 className={styles.temp}>{kelvinToCelsius(weatherData.main.temp).toFixed(2)}°C</h1>
                            <div className={styles.flex}>
                                <img
                                    // src="https://openweathermap.org/img/wn/04n.png"
                                    alt=""
                                    className="icon"
                                />
                                <div className={styles.description}>{weatherData.weather[0].description}</div>
                            </div>
                            <div className={styles.details}>Humidity: {weatherData.main.humidity}%</div>
                            <div className={styles.details}>Wind Speed: {weatherData.wind.speed} m/s</div>
                            <div className={styles.details}>Pressure: {weatherData.main.pressure} hPa</div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default WeatherPage;
