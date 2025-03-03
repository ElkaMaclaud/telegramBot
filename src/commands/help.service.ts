export class HelpService {
    static getHelpText(): string {
        return "Я могу помочь вам с несколькими командами:\n\n" +
            "/start - Начать работу с ботом\n" +
            "/help - Показать доступные команды\n" +
            "/weather - Узнать погоду в вашем городе\n" +
            "/convert - Конвертер валют"  
    }
}