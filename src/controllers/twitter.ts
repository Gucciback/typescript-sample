const Twitter = require('twitter'),
      models = require('../models/index'),
      config = require('../config');

const client = new Twitter(config.twitter_api_config);

export function proceed(params){
    let client_params = {screen_name: params.login, include_rts: false, trim_user: true, tweet_mode: 'extended'};
    return new Promise(resolve => {
        client.get('statuses/user_timeline', client_params, function(error, tweets, response) {
            if (!error)
                resolve(tweets);
            else
                resolve(false);
        });
    });
}

export function checkUnique (data) {
    return new Promise(resolve => {
        models.twitter.find({
            message_id: data.id
        }, function (err, result) {
            if(err)
                resolve(false);
            else
                if(result.length > 0)
                    resolve(false);
                else
                    resolve(true);

        })
    });
}

export function addTweet(data){
    return new Promise((resolve, reject) => {
        models.twitter.create({
            message_id: data.id
        }, function (err, result) {
            if(err)
                reject(false);
            else
            if(result.length > 0)
                resolve(false);
            else
                resolve(true);

        })
    });
}