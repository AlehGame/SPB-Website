import contactRequest from './contactRequest'
import project from './project'
import review from './review'

// Публичный датасет: то, что показывается на сайте
export const siteTypes = [project, review]
// Закрытый датасет: заявки клиентов
export const requestTypes = [contactRequest]
