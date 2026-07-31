const amqp = require('amqplib');

const MATCH_COMPLETED_QUEUE = 'match.completed';

let connection;
let channel;

function getRabbitUrl() {
  return process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';
}

async function getChannel() {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(getRabbitUrl());
  connection.on('close', () => {
    channel = null;
    connection = null;
  });
  connection.on('error', () => {
    channel = null;
    connection = null;
  });

  channel = await connection.createChannel();
  await channel.assertQueue(MATCH_COMPLETED_QUEUE, { durable: true });

  return channel;
}

async function publishMatchCompleted(payload) {
  const activeChannel = await getChannel();
  return activeChannel.sendToQueue(
    MATCH_COMPLETED_QUEUE,
    Buffer.from(JSON.stringify(payload)),
    {
      contentType: 'application/json',
      persistent: true,
    },
  );
}

async function consumeMatchCompleted(handler) {
  const activeChannel = await getChannel();
  await activeChannel.prefetch(1);

  await activeChannel.consume(MATCH_COMPLETED_QUEUE, async (message) => {
    if (!message) {
      return;
    }

    try {
      const payload = JSON.parse(message.content.toString());
      await handler(payload);
      activeChannel.ack(message);
    } catch (error) {
      console.error(`RabbitMQ match.completed failed: ${error.message}`);
      activeChannel.nack(message, false, false);
    }
  });
}

async function closeRabbitMQ() {
  if (channel) {
    await channel.close();
    channel = null;
  }

  if (connection) {
    await connection.close();
    connection = null;
  }
}

module.exports = {
  MATCH_COMPLETED_QUEUE,
  closeRabbitMQ,
  consumeMatchCompleted,
  publishMatchCompleted,
};
