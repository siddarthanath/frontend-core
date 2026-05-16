export const MODAL_KEYS = {
  INVITE_MEMBER: "invite-member",
  CONFIRM_DELETE: "confirm-delete",
  UPGRADE_PLAN:   "upgrade-plan",
  CREATE_ORG:     "create-org",
  CHANGE_ROLE:    "change-role",
  SETTINGS:       "settings",
} as const

export type SettingsSection = "general" | "billing" | "security" | "account"
