import { Metadata } from 'next';

import Link from 'next/link';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'History',
  description: 'Show all the history of the copies generated by you',
};

export default async function HistoryPage() {
  const user = await getCurrentUser();

  let res;
  if (user && user.id) {
    res = await db.content.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });
  } else {
    console.log('User ID cannot be empty');
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mt-16 flex items-center justify-between">
        <h1 className="h4">Generated marketing copy</h1>
      </div>
      {/* History of generated copies */}
      <div className="mx-auto mb-32 mt-16 flex w-full flex-col gap-6 lg:w-[624px]">
        {res && res.length ? (
          res.map((copy, copyIndex) => (
            <div
              key={copyIndex}
              className="border-slate-6  flex flex-col gap-6 rounded-[4px] border p-10"
            >
              <div className="flex flex-col gap-8">
                <h2 className="body-l-semibold">{copy.prompt}</h2>
                <p className="body  ">{copy.generatedContent}</p>
              </div>
              <p className="caption  ">{`Generated on ${new Date(
                copy.generatedAt,
              ).toLocaleDateString()} - ${new Date(
                copy.generatedAt,
              ).toLocaleTimeString()}`}</p>
            </div>
          ))
        ) : (
          <div className="border-slate-6  flex flex-col gap-6 rounded-[4px] border p-10">
            <div className="flex flex-col gap-8">
              <h2 className="body-l-semibold">Oops</h2>
              <p className="body  ">
                You have not generated any copies, go ahead and generate one.
              </p>
            </div>
            {/* // todo */}
            <Button asChild>
              <Link href="/translator">Generate Copy</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
