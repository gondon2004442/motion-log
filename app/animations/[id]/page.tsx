import { getAnimationById } from "@/animations";
import AnimView from "@/components/AnimView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type P = { params: { id: string } };

export function generateMetadata({ params }: P): Metadata {
  const a = getAnimationById(params.id);
  if (!a) {
    return { title: "Not found" };
  }
  return {
    title: a.name,
    description: a.description,
    openGraph: {
      title: `${a.name} · animpreview`,
      description: a.description,
      type: "website",
      url: `/animations/${a.id}`,
    },
    twitter: {
      title: `${a.name} · animpreview`,
      description: a.description,
    },
  };
}

export default function AnimationPage({ params }: P) {
  const a = getAnimationById(params.id);
  if (!a) {
    notFound();
  }
  return <AnimView animation={a} />;
}
