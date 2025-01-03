import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';  

// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// HistoryService class to handle the city history operations
class HistoryService {
  // Read the data from searchHistory.json
  private async read() {
    try {
      const data = await fs.readFile('db/searchHistory.json', {
        flag: 'a+',  
        encoding: 'utf8',
      });
      return data;
    } catch (err) {
      console.error('Error reading file:', err);
      return '[]'; 
    }
  }

  // Write the updated cities array to searchHistory.json
  private async write(cities: City[]) {
    try {
      await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
    } catch (err) {
      console.error('Error writing to file:', err);
    }
  }

 
  async getCities() {
    const cities = await this.read();
    let parsedCities: City[] = [];

    try {
      parsedCities = JSON.parse(cities);
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }

    return parsedCities;
  }

  // Add a new city to the searchHistory.json file
  async addCity(_city: string) {
    const newCity: City = new City(_city, uuidv4());
    const cities = await this.getCities();
    cities.push(newCity);
    await this.write(cities);
  }
}

export default new HistoryService();
// * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file

