import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CONCEPT_MAP_NODES, type ConceptNode } from '../data/theoryCurriculum';

interface ConceptMapViewProps {
  onOpenChapter: (chapterId: string) => void;
}

export function ConceptMapView({ onOpenChapter }: ConceptMapViewProps) {
  const [selectedId, setSelectedId] = useState<string>('chain-3');
  const selectedNode: ConceptNode =
    CONCEPT_MAP_NODES.find((n) => n.id === selectedId) ?? CONCEPT_MAP_NODES[0];

  const tier1 = CONCEPT_MAP_NODES.filter((n) => n.tier === 1);
  const tier2 = CONCEPT_MAP_NODES.filter((n) => n.tier === 2);
  const tier3 = CONCEPT_MAP_NODES.filter((n) => n.tier === 3);

  const renderNodeCard = (node: ConceptNode) => {
    const active = node.id === selectedId;
    return (
      <button
        key={node.id}
        type="button"
        onClick={() => setSelectedId(node.id)}
        className={`w-full text-left rounded-xl border p-4 transition-all cursor-pointer ${
          active
            ? 'border-[#7A1228] bg-[#FDF5F6]'
            : 'border-stone-200 bg-white hover:border-stone-300'
        }`}
      >
        <div className="text-sm font-bold text-stone-900">{node.title}</div>
        <div className="mt-1.5 font-mono text-xs font-semibold text-[#7A1228]">
          {node.shortFormula}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
          Peta Konsep Terstruktur
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
          Alur Penalaran Fisika Soal Nomor 14 OSK 2026
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Klik setiap simpul konsep di bawah ini untuk melihat hubungan antarprinsip
          dari hukum kekekalan dasar hingga optimasi massa perantara m₂ = √(m₁m₃) dan
          kondisi batas tumbukan susulan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="mb-2.5 text-xs font-bold text-stone-500">
              Tingkat 1 · Hukum Kekekalan Dasar
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tier1.map(renderNodeCard)}
            </div>
          </div>

          <div className="flex justify-center text-xs font-semibold text-stone-400">
            ↓ Digabungkan untuk Tumbukan 1D
          </div>

          <div>
            <div className="mb-2.5 text-xs font-bold text-stone-500">
              Tingkat 2 · Formulasi Tumbukan Elastis Dua Benda
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tier2.map(renderNodeCard)}
            </div>
          </div>

          <div className="flex justify-center text-xs font-semibold text-stone-400">
            ↓ Diperluas menjadi Rantai Beruntun &amp; Optimasi
          </div>

          <div>
            <div className="mb-2.5 text-xs font-bold text-stone-500">
              Tingkat 3 · Inti Soal No. 14 &amp; Pengembangan Olimpiade
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {tier3.map(renderNodeCard)}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-stone-200 bg-white p-6 lg:col-span-5 lg:self-start">
          <div className="text-xs font-bold text-[#7A1228]">
            Detail Simpul Terpilih · Tingkat {selectedNode.tier}
          </div>
          <h3 className="mt-2 text-xl font-extrabold text-stone-900">
            {selectedNode.title}
          </h3>
          <div className="mt-4 rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] px-4 py-3 font-mono text-sm font-bold text-[#7A1228]">
            {selectedNode.shortFormula}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-700">
            {selectedNode.description}
          </p>

          {selectedNode.connections.length > 0 && (
            <div className="mt-5 border-t border-stone-100 pt-4">
              <div className="text-xs font-semibold text-stone-500 mb-2">
                Terhubung langsung ke:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.connections.map((connId) => {
                  const target = CONCEPT_MAP_NODES.find((n) => n.id === connId);
                  if (!target) return null;
                  return (
                    <button
                      key={connId}
                      type="button"
                      onClick={() => setSelectedId(connId)}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:border-[#7A1228] hover:text-[#7A1228] cursor-pointer"
                    >
                      {target.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onOpenChapter(selectedNode.chapterId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A1228] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer"
            >
              Pelajari Materi Lengkap di Teori
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
