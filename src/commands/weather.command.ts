import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { getWeatherForCity } from "../requests";

export class WeatherCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command('weather', async (ctx) => {
            await ctx.reply('Пожалуйста, введите название вашего города');
            ctx.session.isWaitingForCity = true;
        });

        this.bot.on('text', async (ctx) => {
            if (ctx.session.isWaitingForCity) {
                const city = ctx.message.text;
                const { temperature, weather_descriptions, wind_speed, humidity } = await this.getWeatherForCity(city);
                await ctx.reply(`Температура: ${temperature}\nОписание погоды: ${weather_descriptions}\nСкорость ветра: ${wind_speed}\nВлажность: ${humidity}`);
                ctx.session.isWaitingForCity = false;
            }
        });

        // this.bot.action('weather_again', async (ctx) => {
        //     await ctx.reply('Пожалуйста, введите название вашего города');
        //     if (ctx.message && typeof ctx.message.text === 'string') {
        //         const { temperature, weather_descriptions, wind_speed, humidity } = await this.getWeatherForCity(ctx.message.text);
        //         ctx.reply(`Температура: ${temperature}\nОписание погоды: ${weather_descriptions}\nСкорость ветра: ${wind_speed}\nВлажность: ${humidity}`);
        //     }
        // });
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
}