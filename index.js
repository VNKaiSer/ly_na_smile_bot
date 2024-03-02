const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const ytdl = require("ytdl-core");
dotenv.config();
const food = require("./eat");
// replace the value below with the Telegram token you receive from @BotFather
const token = "6590273006:AAF2-oKXBalKYE872wKYdY3m1ne6b5xV-to";
const tokenSpotify =
  "BQAGHMsd3TFDgI9l8HbUPlEwMVfpvQyvt8SeFRKeB4bpDmFQaUaobDdmjavoTKOlPP7ME3qIIILYWidHkmtf9Nk1h4gkICpoGCfsbT";
let i = 1;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

const commands = {
  commands: [
    {
      command: "start",
      description: "Start using bot",
    },
    {
      command: "help",
      description: "Display help",
    },
    {
      command: "eat",
      description: "Hôm nay ăn gì?",
    },
    {
      command: "play",
      description: "Phát nhạc diu túp",
    },
    {
      command: "dice",
      description: "roll xúc sắc",
    },
  ],
  language_code: "en",
};

bot.setMyCommands(commands.commands);

// Listen for the /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  // Generate the message with command suggestions
  const message = `Here are the available commands:\n${commands.join("\n")}`;

  // Send the message to the user
  bot.sendMessage(chatId, message);
});

bot.onText(/\/eat/, (msg) => {
  const chatId = msg.chat.id;

  // Generate the message with command suggestions
  const message = "Hôm nay tôi sẽ chọn cho bạn một món ăn";
  bot.sendMessage(chatId, message);
  setTimeout(() => {
    bot.sendMessage(
      chatId,
      "Tôi nghĩ bạn nên ăn " + food[(Math.random() * food.length) | 0]
    );
  }, 3000);

  // Send the message to the user
  //   bot.sendMessage(chatId, message);
});

bot.on("message", (msg) => {
  if (msg.text == "Hông thích" || msg.text == "Nô") {
    bot.sendMessage(
      msg.chat.id,
      "Hông thích cũng phải thích thế hỏi tao làm gì"
    );
  }
});

bot.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  try {
    // Check if the URL is a valid YouTube link
    if (ytdl.validateURL(url)) {
      // Stream the audio from YouTube and send it as voice message
      const stream = ytdl(url, { filter: "audioonly" });
      bot.sendVoice(chatId, stream);
    } else {
      bot.sendMessage(chatId, "Invalid YouTube URL!");
    }
  } catch (error) {
    console.error("Error:", error);
    bot.sendMessage(chatId, "An error occurred while processing your request.");
  }
});

bot.onText(/\/playlist/, async (msg) => {
  const chatId = msg.chat.id;
  const playlistId = "3ywbAlvvwHlnb0OtANgIxJ";
  const playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;

  // Send the playlist URL as a message
  bot.sendMessage(chatId, `Here's the Spotify playlist: ${playlistUrl}`);
});

bot.onText(/\/dice/, (msg) => {
  const chatId = msg.chat.id;

  // Set type to '\ud83c\udfc0' for a dice with 5 spots

  bot.sendDice(chatId, {
    emoji: "🎲",
    value: 2,
  });
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   console.log(chatId);
//   console.log(msg);

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, "Received your message");
// });
