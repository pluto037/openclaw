# DingTalk (钉钉)

OpenClaw supports DingTalk (钉钉) via the `extensions/dingtalk` plugin.

## Features

- **Group Robot**: Send messages to DingTalk groups via Webhook.
- **Enterprise Internal Robot**: Send/receive messages (partial support).
- **Outgoing Webhook**: Receive @mentions in groups.

## Configuration

### Group Robot (Send Only)

To send messages to a DingTalk group, create a Custom Robot in the group settings and get the Webhook URL.

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "webhookUrl": "https://oapi.dingtalk.com/robot/send?access_token=YOUR_ACCESS_TOKEN",
      "secret": "SEC..." // Optional: Signature secret
    }
  }
}
```

### Outgoing Webhook (Receive)

To receive messages, configure an Outgoing Webhook in your DingTalk Robot settings.

1. Set the URL to your OpenClaw Gateway address: `https://your-gateway.com/webhooks/dingtalk/default`
2. Set the `Token` in DingTalk settings.
3. Configure OpenClaw:

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "webhookSecret": "YOUR_TOKEN" // Verify requests
    }
  }
}
```

## Usage

Send a message to a group (via Webhook):

```bash
openclaw message send --channel dingtalk --to "group" "Hello DingTalk!"
```

Note: For Group Robot Webhook, the `to` parameter is ignored (it always sends to the configured webhook group), unless you have multiple accounts configured.
