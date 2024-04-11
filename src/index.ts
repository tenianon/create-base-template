import path from 'path'
import prompts from 'prompts'
import { language } from './i18n/index'
;(async () => {
  const a = '1'
  const x = 2
  const locale = Intl.DateTimeFormat().resolvedOptions().locale

  const currentDir = path.resolve('.')
  const isRootDir = currentDir === path.parse(currentDir).root

  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: language[locale]
      ? language[locale].qProjectName
      : language['en-US'].qProjectName,
    validate: async (value) => {
      if (value === '.') {
        if (!isRootDir) {
          return true
        } else {
          return language[locale]
            ? language[locale].eProjectName1
            : language['en-US'].eProjectName1
        }
      } else if (value.match(/^[a-zA-Z0-9-_]+$/)) {
        return true
      } else {
        return language[locale]
          ? language[locale].eProjectName2
          : language['en-US'].eProjectName2
      }
    },
  })

  console.log(response)
})()
