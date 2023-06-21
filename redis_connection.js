const redis = require('redis');

//connect to redis
const redis_client  = redis.createClient();

redis_client.on("connect", () => console.log("Connected to Redis"));

redis_client.connect();

module.exports = redis_client;