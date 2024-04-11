interface Language {
  [key: string]: {
    [key: string]: string
  }
}

export const language: Language = {
  'en-US': {
    qProjectName: 'Please enter project name',
    eProjectName1: 'Invalid directory path',
    eProjectName2:
      'Only valid project names with letters, numbers, dashes, or underscores are supported',
  },
  'zh-CN': {
    qProjectName: '请输入项目名称',
    eProjectName1: '无效的目录路径',
    eProjectName2: '只支持字母、数字、破折号或下划线输入有效的项目名称',
  },
}
