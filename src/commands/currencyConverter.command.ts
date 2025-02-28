import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { convertCurrency } from "../requests";

export class CurrencyConverterCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command('convert', async (ctx) => {
            await ctx.reply('Пожалуйста, введите сумму и валюту, которую хотите конвертировать (например, "100 USD to EUR")');
            ctx.session.isWaitingForConversion = true;
        });

        this.bot.on('text', async (ctx) => {
            if (ctx.session.isWaitingForConversion) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [amount, fromCurrency, _, toCurrency] = ctx.message.text.split(' ');
                const convertedAmount = await this.convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
                await ctx.reply(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
                ctx.session.isWaitingForConversion = false;
            }
        });
    }

    private async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        try {
            const rate = await convertCurrency(fromCurrency, toCurrency, process.env.apiKey as string)
            return amount * rate;
        } catch (error) {
            console.error('Error fetching currency conversion data:', error);
            return 0;
        }
    }
}