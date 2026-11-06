import type { Metadata } from "next";
import CourseDetailContent from "./course-detail-content";
import {
  courseOgImage,
  fetchCourseSocialMetadata,
  truncateDescription,
} from "@/lib/course-metadata";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await fetchCourseSocialMetadata(id);

  if (!course) {
    return {
      title: "Course not found",
      description:
        "This course could not be found. Browse the ByteChain Academy catalogue to find another course.",
    };
  }

  const path = `/courses/${course.id}`;
  const title = `${course.title} | ByteChain Academy`;
  const description = truncateDescription(
    course.description || `Learn ${course.title} on ByteChain Academy.`,
  );
  const image = courseOgImage(course);

  return {
    title: course.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "ByteChain Academy",
      title,
      description,
      url: path,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${course.title} on ByteChain Academy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params;
  return <CourseDetailContent id={id} />;
}
