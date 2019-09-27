/**
 * 专门处理时间的功能模块
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

dayjs.extend(relativeTime)

export const relativeDate = time => {
  return dayjs().from(dayjs(time))
}
export const formatDate = time => {
  return dayjs(time).format('YYYY-MM-DD')
}
