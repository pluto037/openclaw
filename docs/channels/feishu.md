# Feishu (Lark)

OpenClaw supports [Feishu / Lark](https://open.feishu.cn/) Open Platform integration.

## Features

- **Bot**: Send and receive messages via Feishu Bot.
- **Webhook**: Receive message events via Event Subscription.
- **Messaging**: Support for Text messages in Groups and Private chats.

## Configuration

To use a Feishu bot, you need to create an application in the [Feishu Developer Console](https://open.feishu.cn/app).

### 1. Create App & Get Credentials

Obtain the following credentials:
- **App ID** (`cli_...`)
- **App Secret**
- **Verification Token**
- **Encrypt Key** (Optional, if encryption is enabled)

### 2. Configure Permissions

Enable the following permissions in "Permissions & Scopes":
- `im:message` (Access messages)
- `im:message.group_at_msg` (Read group messages mentioning bot)
- `im:message.p2p_msg` (Read private messages)
- `im:message:send_as_bot` (Send messages as bot)

### 3. Configure Event Subscription

In "Event Subscriptions":
1. Set the Request URL to your OpenClaw Gateway: `https://your-gateway.com/webhooks/feishu/default`
2. Subscribe to the event `im.message.receive_v1` (Receive messages).

### 4. OpenClaw Config

Add to `config.json`:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_...",
      "appSecret": "...",
      "verificationToken": "..."
    }
  }
}
```

## Usage

Send a message:

```bash
openclaw message send --channel feishu --to "chat_id" "Hello Feishu!"
```

To find the `chat_id`, you can inspect the logs when the bot receives a message, or use the Feishu API debugging tools.
