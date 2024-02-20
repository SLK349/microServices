const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://loclhost:9200" });

module.exports = client;
