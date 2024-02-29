/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Context, Markup, Telegraf } from "telegraf";
import { config } from "dotenv";
import { WebSocket } from "ws";
config();

// @ts-ignore
const bot: Telegraf<Context<Update>> = new Telegraf(
  String(process.env.BOT_TOKEN)
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chatId: number = 1266724954;

// const coin = "ethusdt";
// wss://stream.binance.com:9443
// const ws = new WebSocket(`wss://testnet.binance.vision/ws/${coin}@depth`);
const ws = new WebSocket(
 String(process.env.WEBSOCKET_URL)
);

import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Update, CallbackQuery } from "telegraf/typings/core/types/typegram";

let appProcess: ChildProcessWithoutNullStreams;
const GREATER_TIME = 700000;
const LESS_TIME = 100000;

function startApp() {
  try {
    console.log("Starting app...");
    appProcess = spawn("node", ["build/index.js"]);

    appProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    appProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    appProcess.on("close", (code) => {
      console.log(`App process exited with code ${code}`);
      // Automatically restart the app if it crashes
      startApp();
    });
  } catch (err) {
    console.log(err);
  }
}

bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const start_bot = `
  🤖  MARKET SELLS ALERT 🔔 \n 
  📢 Welcome  ${ctx.from.first_name}  to MARKET SELLS ALERT 📈💰
  
  MARKET SELLS is your personal assistant for cryptocurrency trading. With Market Sells, you can stay updated on the latest cryptocurrency prices, execute trades automatically based on predefined strategies, and receive personalized insights to help you make informed trading decisions.</p>
  
  Here are some key features of Market Sells:
  
  1. Real-time Crypto Sells Updates: Get instant updates on cryptocurrency sells order from various exchanges, including Bitcoin (BTC), Ethereum (ETH), and many others.
  
  2. Customizable Sells Order View: Gives your realtime sells to enable you develope a robost trading strategy to maximize your profits.
  
  4. Technical Analysis: Help users to make wise trade decisions and  identify trading opportunities, and make data-driven decisions.
  
  5. Notifications and Alerts: Receive customizable alerts and notifications for price movements, trading signals, and important market events, ensuring that you never miss out on potential opportunities.
  
  To get started, simply use the commands provided or explore the menu options to access Market Sells features and functionalities.
  
  🚀 Start your Market Sells Alert  journey with Market Sells Alert today! 🚀 
  
  
  Market Sells Instructions:
  
  1️⃣ Click on initialize Botton to start Bot rightaway
  
  2️⃣ Click on the Cstomize Bot before starting Bot. 
  
  
  NOTE: Please ensure to operate bot in accordiance with Terms and Condition.
  `;

    bot.telegram.sendMessage(
      userId,
      start_bot,
      Markup.inlineKeyboard([
        Markup.button.callback("initalize Bot", "bot_start"),
        Markup.button.callback("Customize Bot", "bot_customize"),
      ])
    );
  } catch (err) {
    console.log(err);
  }
});

bot.help((ctx) => {
  try {
    ctx.reply("Send /start to cotinue with Bot");
  } catch (err) {
    console.log(err);
  }
});

bot.action("bot_start", async (ctx) => {
  try {
    const userId = ctx.from.id;

    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("message", (data?: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const binanceData = JSON.parse(data);
      const { a: sell_amount, s: symbol } = binanceData;

      if (binanceData.a) {
        let market_alert;
        sell_amount.forEach((data: string) => {
          const sells = String(data).split(",")[0];
          const quantity = String(data).split(",")[1];
          market_alert = `
          📢 MARKET SELLS ALERT 🔔 
  
          TRX ASSETS : ETH/USDT  💰💰💰 
  
          Sell Order: 
  
          Eth sell Price $${sells} - Eth Quantity ${quantity} - Symbol : ${symbol} 
  
          Click to /quit_bot Bot 
          `;
        });
        if (market_alert == undefined) return;
        bot.telegram.sendMessage(
          userId,
          market_alert,
          Markup.inlineKeyboard([
            Markup.button.callback("stop Bot", "quit_bot"),
          ])
        );
        // Here you can implement your notification logic
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  } catch (err) {
    console.log(err);
  }
});

bot.action("bot_customize", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const customize_text = `
     🤖  Welcome to Market Sells Alert 📈💰
     
     📢 Welcome  ${ctx.from.first_name} to MARKET SELLS ALERT 📈💰
   
     Market Sells Alert is your personal cryptocurrency assistant, and you can customize it to suit your preferences and needs. Here's how:
     
     Set Your Target Sells Volume: Use the /less_than or /greater_than command to choose which sales volume  you want Market Sells to track.
     
     Define Frequency of tracking : Set up frequency alerts for specific Market sells volume using the /less_1m command or /greater_1m. For example, /less_1m to display market sells volume within less than 1 minute the /greater_1m for more.
    
     Feedback and Support: Your feedback is valuable! If you have any suggestions or encounter issues, feel free to reach out to us using the /help command.
     
     Enjoy using Market Sells, and happy trading!  🚀📊
     
     `;
    if (userId) {
      bot.telegram.sendMessage(
        userId,
        customize_text,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(`Sells <$2000`, "less_than"),
            Markup.button.callback(`Sells >$2000`, "greater_than"),
          ],
          [
            Markup.button.callback(`Interval <1m `, "less_1m"),
            Markup.button.callback(`Interval >1m `, "greater_1m"),
          ],
        ])
      );
    }
  } catch (err) {
    console.log(err);
  }
});

bot.action("greater_1m", async (ctx) => {
  try {
    const userId = ctx.from.id;

    bot.telegram.sendMessage(
      userId,
      `You have accepted to recieve sell signals within timeframe above 1 minute.`,
      Markup.inlineKeyboard([
        Markup.button.callback(`Initiate`, "enter_greater"),
      ])
    );
  } catch (err) {
    console.log(err);
  }
});

function setTimer(
  ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    Omit<Context<Update>, keyof Context<Update>> & { match: RegExpExecArray },
  times: number
) {
  try {
    const userId = ctx?.from.id;

    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("error", (error: unknown) => {
      console.error("WebSocket error:", error);
    });

    ws.on("message", (data?: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const binanceData = JSON.parse(data);
      const { a: sell_amount, s: symbol } = binanceData;

      if (binanceData.a) {
        let market_alert;
        sell_amount.forEach((data: string) => {
          const sells = String(data).split(",")[0];
          const quantity = String(data).split(",")[1];
          market_alert = `
          📢 MARKET SELLS ALERT 🔔 
  
          TRX ASSETS : ETH/USDT  💰💰💰 
  
          Sell Order: 
  
          Eth sell Price $${sells} - Eth Quantity ${quantity} - Symbol : ${symbol} 
  
          Click to /quit_bot Bot 
          `;
        });

        if (market_alert == undefined) return;

        bot.telegram.sendMessage(
          userId,
          market_alert,
          Markup.inlineKeyboard([
            Markup.button.callback("stop Bot", "quit_bot"),
          ])
        );
        // Here you can implement your notification logic
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
    setTimeout(setTimer, times);
  } catch (err) {
    console.log(err);
  }
}

bot.action("enter_greater", async (ctx) => {
  try {
    setTimer(ctx, GREATER_TIME);
  } catch (err) {
    console.log(err);
  }
});

bot.action("enter_less", async (ctx) => {
  try {
    const userId = ctx.from.id;
    bot.telegram.sendMessage(
      userId,
      `You have accepted to recieve sell signals within timeframe below 1 minute.`,
      Markup.inlineKeyboard([Markup.button.callback(`Initiate`, "enter_less")])
    );
  } catch (err) {
    console.log(err);
  }
});

function less_timer(
  ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    Omit<Context<Update>, keyof Context<Update>> & { match: RegExpExecArray },
  times: number
) {
  try {
    const userId = ctx.from.id;
    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("error", (error: unknown) => {
      console.error("WebSocket error:", error);
    });

    ws.on("message", (data?: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const binanceData = JSON.parse(data);
      const { a: sell_amount, s: symbol } = binanceData;

      if (binanceData.a) {
        let market_alert;
        sell_amount.forEach((data: string) => {
          const sells = String(data).split(",")[0];
          const quantity = String(data).split(",")[1];
          market_alert = `
          📢 MARKET SELLS ALERT 🔔 
  
          TRX ASSETS : ETH/USDT  💰💰💰 
  
          Sell Order: 
  
          Eth sell Price $${sells} - Eth Quantity ${quantity} - Symbol : ${symbol} 
  
          Click to /quit_bot Bot 
          `;
        });

        if (market_alert == undefined) return;

        bot.telegram.sendMessage(
          userId,
          market_alert,
          Markup.inlineKeyboard([
            Markup.button.callback("Stop Bot", "quit_bot"),
          ])
        );
        // Here you can implement your notification logic
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
    setTimeout(less_timer, times);
  } catch (err) {
    console.log(err);
  }
}

bot.action("less_1m", async (ctx) => {
  try {
    less_timer(ctx, LESS_TIME);
  } catch (err) {
    console.log(err);
  }
});

bot.action("greater_than", async (ctx) => {
  try {
    const userId = ctx.from.id;
    bot.telegram.sendMessage(
      userId,
      `You have accepted to recieve sell signals when price is above  $2000.`,
      Markup.inlineKeyboard([Markup.button.callback(`Initiate`, "geater_2000")])
    );
  } catch (err) {
    console.log(err);
  }
});

bot.action("geater_2000", async (ctx) => {
  try {
    const userId = ctx.from.id;

    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("error", (error: unknown) => {
      console.error("WebSocket error:", error);
    });

    ws.on("message", (data?: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const binanceData = JSON.parse(data);
      const { a: sell_amount, s: symbol } = binanceData;

      console.log(sell_amount.flat().join(","));
      if (binanceData.a) {
        let market_alert;
        sell_amount.forEach((data: string) => {
          const sells = String(data).split(",")[0];
          const quantity = String(data).split(",")[1];
          if (Number(sells) > 2000) {
            market_alert = `
            📢 MARKET SELLS ALERT 🔔 
    
            TRX ASSETS : ETH/USDT  💰💰💰 
    
            Sell Order: 
    
            Eth sell Price $${sells} - Eth Quantity ${quantity} - Symbol : ${symbol} 
    
            Click to /quit_bot Bot 
            `;
          }
        });

        if (market_alert == undefined) return;
        bot.telegram.sendMessage(
          userId,
          market_alert,
          Markup.inlineKeyboard([
            Markup.button.callback("Stop Bot", "quit_bot"),
          ])
        );
        // Here you can implement your notification logic
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  } catch (err) {
    console.log(err);
  }
});

bot.action("less_than", async (ctx) => {
  try {
    const userId = ctx.from.id;

    bot.telegram.sendMessage(
      userId,
      `You have accepted to recieve sell signals when price is below  $2000.`,
      Markup.inlineKeyboard([Markup.button.callback(`Initiate`, "less_2000")])
    );
  } catch (err) {
    console.log(err);
  }
});

bot.action("less_2000", async (ctx) => {
  try {
    const userId = ctx.from.id;

    ws.on("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.on("error", (error: unknown) => {
      console.error("WebSocket error:", error);
    });

    ws.on("message", (data?: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const binanceData = JSON.parse(data);
      const { a: sell_amount, s: symbol } = binanceData;

      if (binanceData.a) {
        let market_alert;
        sell_amount.forEach((data: string) => {
          const sells = String(data).split(",")[0];
          const quantity = String(data).split(",")[1];
          if (Number(sells) < 2000) {
            market_alert = `
          📢 MARKET SELLS ALERT 🔔 
  
          TRX ASSETS : ETH/USDT  💰💰💰 
  
          Sell Order: 
  
          Eth sell Price $${sells} - Eth Quantity ${quantity} - Symbol : ${symbol} 
  
          Click to /quit_bot Bot 
          `;
          } else {
            market_alert = `Market Sells Order below $2000 Not Available at the moment`;
          }
        });

        if (market_alert == undefined) return;

        bot.telegram.sendMessage(
          userId,
          market_alert,
          Markup.inlineKeyboard([
            Markup.button.callback("Stop Bot", "quit_bot"),
          ])
        );
        // Here you can implement your notification logic
      }
    });
    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  } catch (err) {
    console.log(err);
  }
});

bot.action("quit_bot", (ctx) => {
  try {
    const userId = ctx.from.id;
    if (userId) {
      ctx.leaveChat();
      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
      startApp();
    }
  } catch (err) {
    console.log(err);
  }
});

bot.on("message", async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    const userId = ctx.from.id;
    if (userId) {
      ctx.leaveChat();
      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
      startApp();
    }
  } catch (err) {
    console.log(err);
  }
});

bot.command("quit", (ctx) => {
  try {
    // Explicit usage
    const userId = ctx.from.id;
    if (userId) {
      ctx.leaveChat();
      ws.on("close", () => {
        console.log("WebSocket connection closed");
      });
    }
  } catch (err) {
    console.log(err);
  }
  // Context shortcut
});
bot.command("keyboard", (ctx) => {
  try {
    ctx.reply(
      "Keyboard",
      Markup.inlineKeyboard([Markup.button.callback("First option", "first")])
    );
  } catch (err) {
    console.log(err);
  }
});

bot.on("text", (ctx) => {
  try {
    ctx.reply(
      "You choose the " +
        (ctx.message.text === "first" ? "First" : "Second") +
        " Option!"
    );
  } catch (err) {
    console.log(err);
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
bot.launch();
