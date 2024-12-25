import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-dvw h-dvh flex flex-col gap-4 justify-center items-center">
      <h1 className="text-2xl font-bold">Syrups - Performance Review Portal</h1>
      <main>
        <Link className="text-lg font-medium hover:underline underline-offset-4" href="/sign-in">
          Click here to start
        </Link>
      </main>
    </div>
  );
}
