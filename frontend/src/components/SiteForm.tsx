"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Sección 1: Parámetros del sitio */}
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xs uppercase tracking-wider">
            PARÁMETROS DEL SITIO
          </CardTitle>
          <CardDescription>
            Definí el sitio a inspeccionar y los límites de profundidad para el crawler.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteNameInput" className="text-slate-600">
                NOMBRE DEL SITIO *
              </Label>
              <Input
                id="siteNameInput"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Tienda Ejemplo"
                className="py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteUrlInput" className="text-slate-600">
                URL BASE DEL SITIO (HOME) *
              </Label>
              <Input
                id="siteUrlInput"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="py-3 text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDepthSelect" className="text-slate-600">
                NIVELES DE HOJAS (MAXDEPTH) *
              </Label>
              <Select
                id="siteDepthSelect"
                value={maxDepth}
                onChange={(e) => setMaxDepth(Number(e.target.value))}
                className="py-2.5 text-sm"
              >
                <option value={1}>1 nivel — Solo Home</option>
                <option value={2}>2 niveles — Home + enlaces directos (por defecto)</option>
                <option value={3}>3 niveles — Home + enlaces + subpáginas</option>
                <option value={4}>4 niveles — Exploración profunda</option>
              </Select>
              <p className="text-xs text-slate-400">
                Límite de tags &lt;a/&gt; anidados a seguir por el job del crawler.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteFrequencySelect" className="text-slate-600">
                FRECUENCIA DE VISITA *
              </Label>
              <Select
                id="siteFrequencySelect"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="py-2.5 text-sm"
              >
                <option value="Cada 1 hora">Cada 1 hora</option>
                <option value="Cada 6 horas">Cada 6 horas</option>
                <option value="Cada 12 horas">Cada 12 horas</option>
                <option value="Cada 24 horas">Cada 24 horas (diaria)</option>
                <option value="Cada 48 horas">Cada 48 horas</option>
                <option value="Semanal">Semanal</option>
              </Select>
              <p className="text-xs text-slate-400">
                Intervalo en el que el scheduler ejecutará el job de extracción.
              </p>
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Sección 2: Snippets de JavaScript */}
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xs uppercase tracking-wider">
            SNIPPETS JAVASCRIPT (CHEERIO)
          </CardTitle>
          <CardDescription>
            Código JavaScript ejecutado en el sandbox del backend para parsear el contenido HTML de cada página.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2">
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
        </CardContent>

        {/* Botones de acción */}
        <CardFooter className="justify-between px-8 py-5">
          <Link
            href={cancelHref}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </Link>
          <Button type="submit" size="lg">
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
