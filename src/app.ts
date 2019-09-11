import * as controllers from './controllers/index';
import config from './config';
import * as mongoose from 'mongoose';
import Telegraf from 'telegraf';
import * as SocksAgent from 'socks5-https-client/lib/Agent';
import * as moment from 'moment';
import * as _cliProgress from 'cli-progress';


mongoose.connect(config.mongodb.url, {useNewUrlParser: true}, (err) => {
    if (err) throw err;
}).catch((error) => console.log(error));

mongoose.set('debug', false);

process.on('SIGTERM', () => {
    mongoose.connection.close(false, () => {
        console.log('Closed connection');
        process.exit(0);
    });
});

const bot:any = new Telegraf(config.telegram_bot.token, {
    telegram: {
        agent: new SocksAgent(config.socks5)
    }
});

(async function main() {
    console.log(controllers.helper.memoryUsage());
    let fighters:any = await controllers.helper.openFile(config.fighters_path).catch((error) => {
        console.log(error);
        process.exit(0);
    });

    let fdata:any[] = JSON.parse(fighters.toString());

    async function job() {
        let progress:any = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
        progress.start(fdata.length, 0);
        for (let fighter of fdata) {
            if (fighter.social.length > 0) {
                for (let link of fighter.social) {
                    if (link.startsWith('https://twitter.com')) {
                        let twitter_login:string = link.split('/')[3];
                        let tweets:any = await controllers.twitter.proceed({login: twitter_login});
                        let counter:number = 0;
                        if (tweets) {
                            for (let tweet of tweets) {
                                let tw_date = moment(new Date(tweet.created_at).toISOString());
                                if (tw_date.isValid()) {
                                    if (tw_date.add(2, 'days').isAfter()) {
                                        let status = await controllers.twitter.checkUnique(tweet);
                                        if (status) {

                                            await bot.telegram.sendPhoto(config.telegram_bot.chat_id, fighter.fighter_picture, {caption: fighter.name}).catch((error) => {
                                                console.log(error)
                                            });
                                            await controllers.helper.sleep(1);
                                            await bot.telegram.sendMessage(config.telegram_bot.chat_id, tweet.full_text).catch((error) => {
                                                console.log(error)
                                            });
                                            await controllers.twitter.addTweet(tweet).catch((error) => {
                                                console.log(error);
                                            });
                                            await controllers.helper.sleep(2);
                                            counter++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            progress.increment();
        }
        progress.stop();
        console.log(controllers.helper.memoryUsage());
    }

    while (true) {
        {
            await job();
            await controllers.helper.sleep(config.timeout*60);
        }
    }
})();
