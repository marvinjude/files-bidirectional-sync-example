import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documents",
}

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
