const amqp = require("amqplib");

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

async function publishToQueue(queueName, data) {
  const { connection, channel } = await connectRabbitMQ();

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
  console.log(`Message envoyé à la queue ${queueName}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}

module.exports = { publishToQueue, connectRabbitMQ };
