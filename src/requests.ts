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

export const convertCurrency = async (
  fromCurrency: string,
  toCurrency: string,
  apiKey: string
): Promise<number>  => {
  const url = `http://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': `${apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(`Ошибка: статус код ${res.statusCode}`);
        return;
      }

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          const rate = parsedData.quotes["end_rate"];
          resolve(rate);
        } catch (error) {
          reject(`Ошибка при парсинге JSON: ${(error as Error).message}`);
        }
      });
    });

    req.on('error', (e) => {
      reject(`Ошибка при выполнении запроса: ${e.message}`);
    });

    req.end();
  });
};