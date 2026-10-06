"use client";

import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodeBlock from "@/components/CodeBlock";

interface ClientSnippetsCardProps {
  activeLang: "curl" | "fetch" | "python";
  onLangChange: (lang: "curl" | "fetch" | "python") => void;
  snippet: string;
}

export default function ClientSnippetsCard({
  activeLang,
  onLangChange,
  snippet,
}: ClientSnippetsCardProps) {
  return (
    <Card className="p-6">
      <Tabs
        value={activeLang}
        onValueChange={(val) => onLangChange(val as "curl" | "fetch" | "python")}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Integración en otras aplicaciones (Search Service Spec)
            </CardTitle>
            <CardDescription className="mt-0.5">
              Copiá el snippet correspondiente al lenguaje o herramienta con la que consumirás este microservicio:
            </CardDescription>
          </div>

          <TabsList>
            <TabsTrigger value="curl" className="uppercase font-mono">cURL</TabsTrigger>
            <TabsTrigger value="fetch" className="uppercase font-mono">Fetch</TabsTrigger>
            <TabsTrigger value="python" className="uppercase font-mono">Python</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="curl" className="mt-0">
          <CodeBlock content={snippet} />
        </TabsContent>
        <TabsContent value="fetch" className="mt-0">
          <CodeBlock content={snippet} />
        </TabsContent>
        <TabsContent value="python" className="mt-0">
          <CodeBlock content={snippet} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
