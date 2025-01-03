import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: string;
  tempF: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  windSpeed: number;

  constructor(
    city: string,
    date: string,
    temp: number,
    humidity: number,
    icon: string,
    iconDescription: string,

    windSpeed: number,

  ) {
    this.city = city;
    this.date = date;
    this.tempF = temp;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.windSpeed = windSpeed;

  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;

  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((res) =>
      res.json()
    );
    return response[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { name, lat, lon, country, state } = locationData;

    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };

    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) =>
      this.destructureLocationData(data)
    );
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates)).then(
      (res) => res.json()
    );
    const currentWeather: Weather = this.parseCurrentWeather(
      response.list[0]
    );

    const weatherForecast: Weather[] = this.buildForecastArray(
      currentWeather,
      response.list
    );
    return weatherForecast;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    //console.log(response)
    const currentWeather = new Weather(
      this.city,
      response.main.date,
      response.main.temp,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].Description,
      response.wind.speed,

    );

    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (const day of filteredWeatherData) {
      console.log(day)
      weatherForecast.push(
        new Weather(
          this.city,
          day.dt_txt,
          day.main.temp,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description,
          day.wind.speed,
        )
      );
    }

    return weatherForecast;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    //const currentWeather = this.parseCurrentWeather(weatherData);
    return weatherData;
  }
}
export default new WeatherService();