import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { HelpService } from "./help.service";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session);
            ctx.reply("Вам понравился пост?", Markup.inlineKeyboard([
                Markup.button.callback("👍", "post_like"),
                Markup.button.callback("👎", "post_dislike")
            ]));

            ctx.reply("Выберите команду:", Markup.keyboard([
                [Markup.button.text("😊 Помощь 😊")],
                [Markup.button.text("🌦️ Погода 🌦️")],
                [Markup.button.text("🤓 Конвертёр 🤓")]
            ]).resize().oneTime());
        });

        this.bot.action("post_like", (ctx) => {
            ctx.session.like = true;
            ctx.editMessageText("🎉 Круто!");
        });

        this.bot.action("post_dislike", (ctx) => {
            ctx.session.like = false;
            ctx.editMessageText("😒");
        });

        this.bot.hears("😊 Помощь 😊", (ctx) => {
            ctx.reply(HelpService.getHelpText());
        });

        this.bot.hears("🌦️ Погода 🌦️", (ctx) => {
            ctx.reply("Пожалуйста, введите название вашего города.");
            ctx.session.isWaitingForCity = true
        });

        this.bot.hears("🤓 Конвертёр 🤓", (ctx) => {
            ctx.reply('Пожалуйста, введите сумму и валюту, которую хотите конвертировать (например, "100 USD to EUR")');
        });
    }
}