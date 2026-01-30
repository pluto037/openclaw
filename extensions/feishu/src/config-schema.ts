import { z } from "zod";
import {
  DmPolicySchema,
  GroupPolicySchema,
} from "openclaw/plugin-sdk";

export const FeishuAccountSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
  verificationToken: z.string().optional(),
  encryptKey: z.string().optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: z.array(z.string()).optional(),
  groupPolicy: GroupPolicySchema.optional(),
  groupAllowFrom: z.array(z.string()).optional(),
  webhookPath: z.string().optional(),
});

export const FeishuConfigSchema = z.object({
  enabled: z.boolean().optional(),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
  verificationToken: z.string().optional(),
  encryptKey: z.string().optional(),
  accounts: z.record(z.string(), FeishuAccountSchema).optional(),
  defaults: z
    .object({
      dmPolicy: DmPolicySchema.optional(),
      groupPolicy: GroupPolicySchema.optional(),
    })
    .optional(),
});
