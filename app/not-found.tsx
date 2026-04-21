import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon/android-chrome-192x192.png"
            alt="CarbonHero"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl"
            priority
          />
          <span className="text-sm font-semibold text-slate-500">CarbonHero</span>
        </div>

        <h1 className="mt-6 break-keep text-[1.9rem] font-extrabold leading-tight text-slate-900">잘못된 페이지예요!</h1>
        <p className="mt-4 break-keep text-lg leading-8 text-slate-700">요청하신 페이지를 찾을 수 없습니다.</p>
        <p className="mt-1 break-keep text-lg leading-8 text-slate-700">URL을 다시 확인하시거나 처음으로 돌아가주세요.</p>

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#2f6de9_0%,#1f5edc_45%,#1a4fbe_100%)] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(47,109,233,0.34)] transition-transform hover:-translate-y-0.5"
        >
          진단 시작하러 가기
        </Link>
      </div>
    </main>
  );
}
