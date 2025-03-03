import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { getWeatherForCity, convertCurrency } from "../requests";

export class WeatherCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command('weather', async (ctx) => {
            await ctx.reply('Пожалуйста, введите название вашего города (или введите "exit" для выхода).');
            ctx.session.isWaitingForCity = true;
            ctx.session.isWaitingForConversion = false;
        });

        this.bot.command('convert', async (ctx) => {
            await ctx.reply('Пожалуйста, введите сумму и валюту, которую хотите конвертировать (например, "100 USD to EUR", или введите "exit" для выхода).');
            ctx.session.isWaitingForConversion = true;
            ctx.session.isWaitingForCity = false;
        });

        this.bot.on('text', async (ctx) => {
            const userInput = ctx.message.text.trim().toLowerCase();

            if (userInput === 'exit') {
                ctx.session.isWaitingForCity = false;
                ctx.session.isWaitingForConversion = false;
                await ctx.reply('Вы вышли из текущего режима. Используйте /weather или /convert для начала работы.');
                return;
            }
            if (ctx.session.isWaitingForCity) {
                const city = ctx.message.text;
                const { temperature, weather_descriptions, wind_speed, humidity } = await this.getWeatherForCity(city);
                await ctx.reply(`Температура: ${temperature}\nОписание погоды: ${weather_descriptions}\nСкорость ветра: ${wind_speed}\nВлажность: ${humidity}`);
                await ctx.reply('Введите другой город или "exit" для выхода.');
            } 
            else if (ctx.session.isWaitingForConversion) {
                const [amount, fromCurrency, , toCurrency] = ctx.message.text.split(' ');
                const convertedAmount = await this.convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
                await ctx.reply(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
                await ctx.reply('Введите другую сумму и валюты или "exit" для выхода.');
            } 
            else {
                await ctx.reply('Пожалуйста, используйте команды /weather или /convert для начала работы.');
            }
        });
    }

    private async getWeatherForCity(city: string): Promise<{ temperature: number, weather_descriptions: string, wind_speed: number, humidity: number }> {
        try {
            const weatherData = await getWeatherForCity(city, process.env.tokenForweatherstack as string);
            return weatherData;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return { temperature: 0, weather_descriptions: 'Не удалось получить данные о погоде', wind_speed: 0, humidity: 0 };
        }
    }
    private async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        try {
            const rate = await convertCurrency(fromCurrency, toCurrency, process.env.apiKey as string);
            return amount * rate;
        } catch (error) {
            console.error('Error fetching currency conversion data:', error);
            return 0;
        }
    }
}