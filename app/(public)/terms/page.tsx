import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — APPLI-TRACT',
  description: 'Terms and conditions for using APPLI-TRACT.',
};

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      {
        type: 'paragraph',
        text: 'By accessing or using APPLI-TRACT ("the app") at appli-tract.vercel.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.',
      },
      {
        type: 'paragraph',
        text: 'APPLI-TRACT is a personal project developed by Md. Forhad Reza to help job seekers track their job applications. These terms may be updated at any time, and continued use of the app constitutes acceptance of any changes.',
      },
    ],
  },
  {
    id: 'description',
    title: '2. Description of Service',
    content: [
      {
        type: 'paragraph',
        text: 'APPLI-TRACT provides the following services:',
      },
      {
        type: 'list',
        items: [
          'Job application tracking — manually store and manage job applications including company, role, status, and deadlines',
          'AI-powered job description parsing — paste a job circular and the app extracts structured data automatically using Google Gemini',
          'AI Monitoring (optional) — with your explicit permission, the app scans your Gmail inbox every 30 minutes to detect interview invitations or assessment emails and updates your application status accordingly',
          'In-app notifications — alerts when interview or assessment emails are detected',
        ],
      },
    ],
  },
  {
    id: 'google-api',
    title: '3. Use of Google APIs & Gmail Data',
    content: [
      {
        type: 'paragraph',
        text: "APPLI-TRACT's use of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
      },
      {
        type: 'paragraph',
        text: 'When you enable AI Monitoring and grant Gmail access, APPLI-TRACT will:',
      },
      {
        type: 'list',
        items: [
          'Only read email metadata (subject lines and sender addresses) — never full email bodies',
          'Use Gmail data solely to detect job-related communications such as interview invitations and assessment requests',
          'Never store, transfer, or share your Gmail data with any third party',
          'Never use Gmail data for advertising, profiling, or any purpose unrelated to the core feature',
        ],
      },
      {
        type: 'highlight',
        text: "APPLI-TRACT's use of Gmail data is strictly limited to providing the AI Monitoring feature you explicitly opt into. You can revoke Gmail access at any time from your Google Account settings at myaccount.google.com/permissions without affecting your APPLI-TRACT account.",
      },
    ],
  },
  {
    id: 'user-accounts',
    title: '4. User Accounts',
    content: [
      {
        type: 'paragraph',
        text: 'You may sign in using Google OAuth or GitHub OAuth. By signing in, you authorize APPLI-TRACT to access your basic profile information (name, email, profile picture) as provided by those services.',
      },
      {
        type: 'list',
        items: [
          'You are responsible for maintaining the security of your account',
          'You must not share your account credentials with others',
          'You must provide accurate information when using the app',
          'You must be at least 13 years of age to use this app',
        ],
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use',
    content: [
      {
        type: 'paragraph',
        text: 'You agree not to:',
      },
      {
        type: 'list',
        items: [
          'Use the app for any unlawful purpose or in violation of any applicable laws',
          'Attempt to reverse engineer, hack, or compromise the security of the app',
          'Use the app to store or transmit harmful, offensive, or malicious content',
          "Attempt to access other users' data or accounts",
          'Use automated tools to scrape or extract data from the app beyond its intended use',
        ],
      },
    ],
  },
  {
    id: 'data-privacy',
    title: '6. Data & Privacy',
    content: [
      {
        type: 'paragraph',
        text: 'Your use of APPLI-TRACT is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy at appli-tract.vercel.app/privacy to understand our data practices.',
      },
      {
        type: 'paragraph',
        text: 'You may request deletion of your account and all associated data at any time by contacting forhad.bimt@gmail.com.',
      },
    ],
  },
  {
    id: 'third-party',
    title: '7. Third-Party Services',
    content: [
      {
        type: 'paragraph',
        text: 'APPLI-TRACT integrates with the following third-party services, each governed by their own terms and privacy policies:',
      },
      {
        type: 'list',
        items: [
          'Google OAuth & Gmail API — google.com/policies',
          'GitHub OAuth — docs.github.com/en/site-policy',
          'Google Gemini AI — ai.google.dev',
          'Vercel (hosting) — vercel.com/legal',
          'Neon (database) — neon.tech/privacy',
        ],
      },
      {
        type: 'paragraph',
        text: 'We are not responsible for the practices of these third-party services.',
      },
    ],
  },
  {
    id: 'disclaimer',
    title: '8. Disclaimer of Warranties',
    content: [
      {
        type: 'paragraph',
        text: 'APPLI-TRACT is provided "as is" and "as available" without any warranties of any kind, either express or implied. As a personal project, we do not guarantee:',
      },
      {
        type: 'list',
        items: [
          'Uninterrupted or error-free operation of the app',
          'Accuracy of AI-extracted job data or email classification',
          'That the app will meet your specific requirements',
          'That any data will be preserved indefinitely',
        ],
      },
    ],
  },
  {
    id: 'limitation',
    title: '9. Limitation of Liability',
    content: [
      {
        type: 'paragraph',
        text: 'To the fullest extent permitted by law, Md. Forhad Reza shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of APPLI-TRACT, including but not limited to missed job opportunities, data loss, or unauthorized access to your account.',
      },
    ],
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: [
      {
        type: 'paragraph',
        text: 'We reserve the right to suspend or terminate your access to APPLI-TRACT at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.',
      },
      {
        type: 'paragraph',
        text: 'You may stop using the app at any time. To delete your account and data, contact forhad.bimt@gmail.com.',
      },
    ],
  },
  {
    id: 'changes',
    title: '11. Changes to Terms',
    content: [
      {
        type: 'paragraph',
        text: 'We may update these Terms of Service from time to time. The "Last updated" date below will reflect the most recent revision. Continued use of the app after changes are posted constitutes your acceptance of the revised terms.',
      },
    ],
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: [
      {
        type: 'paragraph',
        text: 'For questions about these Terms of Service, please contact:',
      },
      {
        type: 'contact',
      },
    ],
  },
];

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'highlight'; text: string }
  | { type: 'contact' };

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
        if (block.type === 'contact') {
          return (
            <div
              key={i}
              className="mt-3 rounded-lg border border-border bg-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="text-foreground font-medium">
                  Md. Forhad Reza
                </span>
                <span className="text-muted-foreground">— Developer</span>
              </div>
              <a
                href="mailto:forhad.bimt@gmail.com"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                forhad.bimt@gmail.com
              </a>
              <a
                href="https://forhadreza.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                forhadreza.vercel.app
              </a>
              <a
                href="https://appli-tract.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                appli-tract.vercel.app
              </a>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default function TermsPage() {
  return (
    <>
      <div className="flex-1 py-10 mt-22 mb-10 container max-w-360 mx-auto">
        <div className="mx-auto container max-w-3xl px-4">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full mb-4">
              Terms of Service
            </span>
            <h1 className="text-3xl font-medium text-foreground mb-2">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
              Please read these terms carefully before using APPLI-TRACT.
            </p>
            <div className="flex gap-6 mt-4 flex-wrap">
              <span className="text-xs text-muted-foreground">
                Effective: June 19, 2025
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated: June 19, 2025
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
