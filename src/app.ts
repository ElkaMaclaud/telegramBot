import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { HelpCommand } from "./commands/help.command";
import { WeatherCommand } from "./commands/weather.command";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly  configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"))
        this.bot.use((new LocalSession({ database: 'session_db.json' })).middleware())
    }

    init() {
        this.commands = [new StartCommand(this.bot), new HelpCommand(this.bot), new WeatherCommand(this.bot)];
        for(const command of this.commands) {
            command.handle()
        }
        this.bot.launch()
    }
}

const bot = new Bot(new ConfigService());
bot.init()