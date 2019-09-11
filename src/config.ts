export default {
    twitter_api_config: {
        consumer_key: 'dummy',
        consumer_secret: 'dummy',
        access_token_key: 'dummy',
        access_token_secret: 'dummy'
    },
    vk_api_config: {
        token: 'dummy'
    },
    vk_group_setting: {
        owner_id: 1000213
    },
    fighters_path: '../ufc.json',
    timeout: 60, //timeout in minutes parser checks new posts
    mongodb:{
        url: 'mongodb://localhost:27017/mma_original'
    },
    telegram_bot:{
        token: 'dummy',
        chat_id: 'dummy'
    },
    socks5: {
        socksHost: '127.0.0.1',
        socksPort: 9150,
    }
};