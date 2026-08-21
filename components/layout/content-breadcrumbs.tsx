import Link from "next/link";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

export function ContentBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} aria-current={index === items.length - 1 ? "page" : undefined}>
            {item.href ? <Link href={item.href}>{item.name}</Link> : item.name}
          </li>
        ))}
      </ol>
    </nav>
  );
}

