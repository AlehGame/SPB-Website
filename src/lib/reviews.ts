import review1 from '../assets/video/review-1.mp4'
import review2 from '../assets/video/review-2.mp4'
import review3 from '../assets/video/review-3.mp4'
import { sanityQuery } from './sanity'

export interface Review {
  id: string
  video: string
  /** Подпись для скринридеров; в карточке не показывается */
  title?: string
}

// Показываются, пока в Sanity нет видео-отзывов или он недоступен
export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', video: review1 },
  { id: '2', video: review2 },
  { id: '3', video: review3 },
]

// Отзывы без поля «Порядок» (новые) идут первыми, затем по возрастанию порядка
const QUERY = `*[_type == "review" && defined(video.asset)] | order(coalesce(order, -1) asc, _createdAt desc) {
  _id, title, "video": video.asset->url
}`

interface SanityReview {
  _id: string
  title?: string
  video: string
}

export async function fetchReviews(signal?: AbortSignal): Promise<Review[]> {
  const result = await sanityQuery<SanityReview[]>(QUERY, signal)
  return result.map(({ _id, title, video }) => ({ id: _id, video, title }))
}
