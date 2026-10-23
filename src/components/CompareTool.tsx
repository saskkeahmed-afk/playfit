"use client";

import Link from "next/link";
import { useState } from "react";
import type { BenchmarkObservation, Cpu, Gpu } from "@/lib/types";

type Mode = "gpu" | "cpu";
const typeLabel = { desktop: "مكتبي", laptop: "لابتوب", integrated: "مدمج" } as const;

export function CompareTool({ gpus, cpus, observations }: { gpus: Gpu[]; cpus: Cpu[]; observations: BenchmarkObservation[] }) {
  const [mode, setMode] = useState<Mode>("gpu");
  const [sel, setSel] = useState<string[]>(["", ""]);
  const options = mode === "gpu" ? gpus : cpus;
  const chosenGpus = mode === "gpu" ? sel.map((id) => gpus.find((g) => g.id === id)).filter((g): g is Gpu => !!g) : [];
  const chosenCpus = mode === "cpu" ? sel.map((id) => cpus.find((c) => c.id === id)).filter((c): c is Cpu => !!c) : [];
  const chosen = mode === "gpu" ? chosenGpus : chosenCpus;
  const mixedDevice = new Set(chosenGpus.map((g) => g.deviceType)).size > 1;

  const setAt = (i: number, v: string) => setSel((s) => s.map((x, k) => (k === i ? v : x)));
  const bench = (id: string) => observations.filter((o) => (mode === "gpu" ? o.gpuId : o.cpuId) === id);

  return (
    <div className="space-y-6">
      <div className="panel space-y-4 p-5">
        <fieldset>
          <legend className="label">نوع المقارنة</legend>
          <div className="flex gap-4 text-sm">
            {(["gpu", "cpu"] as const).map((m) => (
              <label key={m} className="flex items-center gap-2"><input type="radio" name="mode" className="accent-[#39ff88]" checked={mode === m} onChange={() => { setMode(m); setSel(["", ""]); }} />{m === "gpu" ? "كروت الشاشة" : "المعالجات"}</label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-3">
          {sel.map((v, i) => (
            <div key={i}>
              <label className="label" htmlFor={`cmp-${i}`}>الخيار {i + 1}{i === 2 ? " (اختياري)" : ""}</label>
              <select id={`cmp-${i}`} className="field" value={v} onChange={(e) => setAt(i, e.target.value)}>
                <option value="">اختر…</option>
                {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          ))}
          {sel.length < 3 && <div className="flex items-end"><button className="btn-ghost" onClick={() => setSel((s) => [...s, ""])}>إضافة خيار ثالث</button></div>}
        </div>
      </div>

      {chosen.length < 2 ? (
        <p className="panel p-6 text-mist-300">اختر عنصرين على الأقل لعرض المقارنة.</p>
      ) : (
        <div className="space-y-4" aria-live="polite">
          {mixedDevice && <p className="rounded-lg border border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-200">تحذير: تقارن بين كروت لابتوب ومكتبية. تشابه الأسماء لا يعني تشابه الأداء؛ كروت اللابتوب تتأثر بحد الطاقة والتبريد.</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <caption className="sr-only">مقارنة المواصفات</caption>
              <thead>
                <tr className="border-b border-ink-700"><th scope="col" className="py-2 text-start text-mist-500">المواصفة</th>
                  {chosen.map((c) => <th key={c.id} scope="col" className="py-2 text-start" dir="ltr"><Link className="hover:text-neon" href={`/${mode}s/${c.id}`}>{c.name}</Link></th>)}</tr>
              </thead>
              <tbody className="[&_td]:py-2 [&_th]:py-2 [&_tr]:border-b [&_tr]:border-ink-800">
                <tr><th scope="row" className="text-start font-normal text-mist-500">الشركة</th>{chosen.map((c) => <td key={c.id}>{c.manufacturer}</td>)}</tr>
                <tr><th scope="row" className="text-start font-normal text-mist-500">المعمارية</th>{chosen.map((c) => <td key={c.id} dir="ltr" className="text-start">{c.architecture}</td>)}</tr>
                {mode === "gpu" ? (
                  <>
                    <tr><th scope="row" className="text-start font-normal text-mist-500">ذاكرة الفيديو</th>{chosenGpus.map((c) => <td key={c.id}>{c.vramGb ? `${c.vramGb}GB` : "مشتركة/غير محددة"}</td>)}</tr>
                    <tr><th scope="row" className="text-start font-normal text-mist-500">النوع</th>{chosenGpus.map((c) => <td key={c.id}>{typeLabel[c.deviceType]}</td>)}</tr>
                  </>
                ) : (
                  <>
                    <tr><th scope="row" className="text-start font-normal text-mist-500">الأنوية</th>{chosenCpus.map((c) => <td key={c.id}>{c.cores}</td>)}</tr>
                    <tr><th scope="row" className="text-start font-normal text-mist-500">الخيوط</th>{chosenCpus.map((c) => <td key={c.id}>{c.threads}</td>)}</tr>
                  </>
                )}
                <tr><th scope="row" className="text-start font-normal text-mist-500">قياسات أداء منشورة</th>{chosen.map((c) => <td key={c.id}>{bench(c.id).length ? `${bench(c.id).length} قياس` : "لا توجد بعد"}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-mist-500">لا نعرض نسب تفوّق أو ترتيباً: لا توجد قياسات منشورة كافية لدعمها. عند إضافة قياسات موثّقة ستظهر هنا مع ظروف الاختبار ومصدرها.</p>
        </div>
      )}
    </div>
  );
}
