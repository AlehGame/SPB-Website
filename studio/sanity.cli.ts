import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'fy6hrt2t',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Привязка к уже развёрнутой Studio: повторный `sanity deploy` обновит её, а не создаст новую
  deployment: {
    appId: 'h0bhts37yufki31lhw4tgd4l',
  },
})
