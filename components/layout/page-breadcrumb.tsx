import Link from "next/link";
import { getToolPage, type ToolKey } from "@/lib/site/tools";

export function PageBreadcrumb({ toolKey }: { toolKey: ToolKey }) {
  const tool = getToolPage(toolKey);
  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li aria-current="page">{tool.title}</li>
      </ol>
    </nav>
  );
}
