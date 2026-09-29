import { redirect } from 'next/navigation';

export default function CourseSlugRedirectPage() {
  redirect('/admin/courses');
}
