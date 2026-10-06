"use client";

import { useState } from "react";
import type { Account } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconCheck } from "@/components/icons";

interface AccountProfileCardProps {
  account: Account;
  onSave?: (name: string) => void;
}

export default function AccountProfileCard({ account, onSave }: AccountProfileCardProps) {
  const [nombre, setNombre] = useState(account.name);
  const [guardado, setGuardado] = useState(false);

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    onSave?.(nombre);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleGuardar}>
        <CardHeader className="flex-row items-center justify-between p-6 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 tracking-wider uppercase">
              DATOS DE LA CUENTA (ACCOUNT)
            </CardTitle>
            <CardDescription>
              Información general asociada al titular de la cuenta y sus accesos SSO.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="accountNameInput" className="text-slate-600">
                NOMBRE DEL TITULAR
              </Label>
              <Input
                id="accountNameInput"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="py-2.5 text-sm bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountEmailInput" className="text-slate-600">
                EMAIL REGISTRADO
              </Label>
              <Input
                id="accountEmailInput"
                type="email"
                disabled
                readOnly
                value={account.email}
                title="El email proviene del proveedor SSO y no puede modificarse"
                className="py-2.5 text-sm font-mono bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Autenticación SSO */}
        <div className="px-6 py-4 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              G
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-800">Autenticación Single Sign-On (Auth0)</Label>
              <div className="text-xs text-slate-500 font-mono">auth0Id: {account.auth0Id || "Sin vincular"}</div>
            </div>
          </div>
          <Badge variant={account.auth0Id ? "success" : "secondary"} dot>
            {account.auth0Id ? "Vinculado con Google" : "Sin vincular a SSO"}
          </Badge>
        </div>

        <CardFooter className="justify-end border-t border-slate-100">
          <Button type="submit">
            {guardado ? (
              <>
                <IconCheck />
                Cambios Guardados
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
