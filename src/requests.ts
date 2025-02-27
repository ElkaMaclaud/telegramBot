import http  from "http";


export const getWeatherForCity = async (city: string, token: string): Promise<{ temperature: number; weather_descriptions: string; wind_speed: number; humidity: number }> => {
    const url = `http://api.weatherstack.com/current?access_key=${token}&query=${city}`
    let data = ""
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Status code: ${res.statusCode}`)
            }
            res.setEncoding('utf8')
            res.on('data', chunk =>
                data += chunk
            )
            res.on('end', () => {
                try {
                    const parseData = JSON.parse(data);
                    const { temperature, weather_descriptions, wind_speed, humidity } = parseData.current;
                    resolve({ temperature, weather_descriptions, wind_speed, humidity });
                } catch (error) {
                    reject(`Ошибка при парсинге JSON: ${(error as Error).message}`);
                }
            });
        }).on('error', (e) => {
            console.error(`MessageError: ${e}`);
            reject(`Ошибка при выполнении запроса: ${e.message}`);
        });
    });
}