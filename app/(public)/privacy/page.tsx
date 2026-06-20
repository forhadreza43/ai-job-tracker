import type { Metadata } from 'next';
import privacyData from './privacy-data.json';

export const metadata: Metadata = {
  title: `Privacy Policy — ${privacyData.meta.appName}`,
  description: 'How APPLI-TRACT collects, uses, and protects your data.',
};

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'highlight'; text: string };

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0"
            >
              {block.text}
            </p>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="flex flex-col gap-2 mb-3 last:mb-0">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-muted-foreground/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'highlight') {
          return (
            <div
              key={i}
              className="bg-muted/50 border border-border rounded-md px-4 py-3 mb-3 last:mb-0"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {block.text}
              </p>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default function PrivacyPage() {
  const { meta, sections } = privacyData;

  return (
    <div className="flex-1 mt-22">
      <div className="mx-auto container max-w-360 px-4 ">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-border">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full mb-4">
            Privacy Policy
          </span>
          <h1 className="text-3xl font-medium text-foreground mb-2">
            {meta.appName} Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            Details of how your information is collected, used and protected.
          </p>
          <div className="flex gap-6 mt-4 flex-wrap">
            <span className="text-xs text-muted-foreground">
              Effective: {meta.effectiveDate}
            </span>
            <span className="text-xs text-muted-foreground">
              Last updated: {meta.lastUpdated}
            </span>
          </div>
        </div>
        {/* Sections */}
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="pb-8 border-b border-border last:border-none last:pb-0"
            >
              <h2 className="text-base font-medium text-foreground mb-3">
                {section.title}
              </h2>
              <ContentRenderer blocks={section.content as ContentBlock[]} />
              {/* Contact section এর জন্য special card */}
              {section.id === 'contact' && (
                <div className="mt-3 rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {meta.developer}
                    </span>
                    <span>—</span>
                    <span>Developer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${meta.email}`}
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {meta.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <a
                      href={meta.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {meta.portfolio.replace('https://', '')}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <a
                      href={meta.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {meta.appUrl.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
