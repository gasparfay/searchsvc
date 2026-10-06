"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";

const DEFAULT_EXTRACTOR = `function extract(request, response) {
  const $ = response.body;

  return [{
    name: $('title').text(),
    url: request.url,
    description:
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('p').first().text().slice(0, 200)
  }];
}`;

const DEFAULT_RESOLVER = `function pageResolver(request, response) {
  const $ = response.body;
  const links = [];

  $('a[href]').each(function () {
    const href = $(this).attr('href');
    if (href && href.startsWith('/')) {
      links.push(request.baseUrl + href);
    }
  });

  return links;
}`;

interface SiteFormValues {
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  extractorSnippet: string;
  pageResolverSnippet?: string;
}

interface SiteFormProps {
  initialData?: Partial<SiteFormValues>;
  onSubmit: (values: SiteFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}

export function SiteForm({
  initialData,
  onSubmit,
  cancelHref,
  submitLabel,
}: SiteFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [maxDepth, setMaxDepth] = useState<number>(initialData?.maxDepth ?? 2);
  const [frequency, setFrequency] = useState(initialData?.frequency ?? "Cada 24 horas");
  const [extractorSnippet, setExtractorSnippet] = useState(
    initialData?.extractorSnippet ?? DEFAULT_EXTRACTOR
  );
  const [pageResolverSnippet, setPageResolverSnippet] = useState(
    initialData?.pageResolverSnippet ?? DEFAULT_RESOLVER
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      url: url.trim(),
      maxDepth,
      frequency,
      extractorSnippet,
      pageResolverSnippet: pageResolverSnippet.trim() ? pageResolverSnippet : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Sección 1: Parámetros del sitio */}
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-900 tracking-wider mb-1">
          PARÁMETROS DEL SITIO
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Definí el sitio a inspeccionar y los límites de profundidad para el crawler.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              NOMBRE DEL SITIO *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tienda Ejemplo"
              className="w-full px-4 py-3 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              URL BASE DEL SITIO (HOME) *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              NIVELES DE HOJAS (MAXDEPTH) *
            </label>
            <select
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full px-4 py-3 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value={1}>1 nivel — Solo Home</option>
              <option value={2}>2 niveles — Home + enlaces directos (por defecto)</option>
              <option value={3}>3 niveles — Home + enlaces + subpáginas</option>
              <option value={4}>4 niveles — Exploración profunda</option>
            </select>
            <p className="text-xs mt-1.5 text-slate-400">
              Límite de tags &lt;a/&gt; anidados a seguir por el job del crawler.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              FRECUENCIA DE VISITA *
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Cada 1 hora">Cada 1 hora</option>
              <option value="Cada 6 horas">Cada 6 horas</option>
              <option value="Cada 12 horas">Cada 12 horas</option>
              <option value="Cada 24 horas">Cada 24 horas (diaria)</option>
              <option value="Cada 48 horas">Cada 48 horas</option>
              <option value="Semanal">Semanal</option>
            </select>
            <p className="text-xs mt-1.5 text-slate-400">
              Intervalo en el que el scheduler ejecutará el job de extracción.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 2: Snippets de JavaScript */}
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-900 tracking-wider mb-1">
          SNIPPETS JAVASCRIPT (CHEERIO)
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Código JavaScript ejecutado en el sandbox del backend para parsear el contenido HTML de cada página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CodeEditor
            label="Document Extractor *"
            badge="Requerido"
            badgeVariant="required"
            filename="extractor.js"
            value={extractorSnippet}
            onChange={setExtractorSnippet}
          />

          <CodeEditor
            label="Page Resolver"
            badge="Opcional"
            badgeVariant="optional"
            filename="resolver.js"
            value={pageResolverSnippet}
            onChange={setPageResolverSnippet}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between px-8 py-5 bg-slate-50">
        <Link
          href={cancelHref}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancelar
        </Link>
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
