require('dotenv').config()

const { Client } = require('discord.js')
const token = process.env.BOT_TOKEN
const client = new Client({
  intents: [/** 必要に応じてIntentを追加すること */]
})

client.once('ready', () => {
  console.log('Ready!')
})

client.on('messageCreate', (message) => {
  console.log('通過！')
  if (message.content === 'やぁ' && !message.author.bot){
    message.reply('こんにちは！').catch(console.error)
  }
})

client.login(token)
  .catch(console.error)
