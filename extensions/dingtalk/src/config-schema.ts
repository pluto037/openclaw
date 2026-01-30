import { z } from "zod";
import {
  DmPolicySchema,
  GroupPolicySchema,
} from "openclaw/plugin-sdk";

export const DingTalkAccountSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  appKey: z.string().optional(),
  appSecret: z.string().optional(),
  agentId: z.string().optional(),
  webhookSecret: z.string().optional(),
  webhookUrl: z.string().optional(),
  secret: z.string().optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: z.array(z.string()).optional(),
  groupPolicy: GroupPolicySchema.optional(),
  groupAllowFrom: z.array(z.string()).optional(),
  webhookPath: z.string().optional(),
});

export const DingTalkConfigSchema = z.object({
  enabled: z.boolean().optional(),
  appKey: z.string().optional(),
  appSecret: z.string().optional(),
  agentId: z.string().optional(),
  webhookSecret: z.string().optional(),
  accounts: z.record(z.string(), DingTalkAccountSchema).optional(),
  defaults: z
    .object({
      dmPolicy: DmPolicySchema.optional(),
      groupPolicy: GroupPolicySchema.optional(),
    })
    .optional(),
});
