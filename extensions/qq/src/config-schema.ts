import { z } from "zod";
import {
  DmPolicySchema,
  GroupPolicySchema,
} from "openclaw/plugin-sdk";

export const QQAccountSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  appId: z.string().optional(),
  token: z.string().optional(),
  clientSecret: z.string().optional(),
  sandbox: z.boolean().optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: z.array(z.string()).optional(),
  groupPolicy: GroupPolicySchema.optional(),
  groupAllowFrom: z.array(z.string()).optional(),
});

export const QQConfigSchema = z.object({
  enabled: z.boolean().optional(),
  appId: z.string().optional(),
  token: z.string().optional(),
  clientSecret: z.string().optional(),
  sandbox: z.boolean().optional(),
  accounts: z.record(z.string(), QQAccountSchema).optional(),
  defaults: z
    .object({
      dmPolicy: DmPolicySchema.optional(),
      groupPolicy: GroupPolicySchema.optional(),
    })
    .optional(),
});
