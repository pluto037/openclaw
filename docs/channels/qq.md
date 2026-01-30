# QQ

OpenClaw supports [QQ Official Bots](https://q.qq.com/) (OpenAPI v2).

## Features

- **Messaging**: Send and receive messages in Guilds (Channels) and Groups (if authorized).
- **Events**: WebSocket-based event listening.
- **Sandboxing**: Support for QQ Sandbox environment.

## Configuration

To use a QQ bot, you need an App ID and Token from the [QQ Open Platform](https://q.qq.com/).

### Config File

Add the following to your `config.json`:

```json
{
  "channels": {
    "qq": {
      "enabled": true,
      "appId": "YOUR_APP_ID",
      "token": "YOUR_BOT_TOKEN",
      "clientSecret": "YOUR_CLIENT_SECRET", // Optional
      "sandbox": false // Set to true for sandbox environment
    }
  }
}
```

### Environment Variables

You can also use environment variables:

```bash
export QQ_APP_ID="YOUR_APP_ID"
export QQ_TOKEN="YOUR_BOT_TOKEN"
export QQ_SANDBOX="true"
```

## Usage

Once configured, OpenClaw will automatically connect to the QQ Gateway and listen for messages.

### Sending Messages

You can send messages using the CLI or via Agent tools:

```bash
openclaw message send --to "CHANNEL_ID" --channel qq "Hello from OpenClaw!"
```

### Direct Messages

Direct messages (DMs) are supported if the bot has the necessary intents and permissions. The `to` parameter should be the Guild ID (for DMs within a Guild context).

## Intents

The bot currently requests the following intents:
- `GUILDS`
- `GUILD_MESSAGES`
- `DIRECT_MESSAGE`
- `GROUP_AT_MESSAGES` (Group chat mentions)

Ensure your bot has these intents enabled in the QQ Open Platform developer console.
