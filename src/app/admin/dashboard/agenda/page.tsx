"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentSlot } from "@/lib/db";

async function fetchAppointments(): Promise<AppointmentSlot[]> {
  const res = await fetch("/api/admin/appointments", { credentials: "include" });
  if (!res.ok) return [];
  return res.json();
}

export default function AgendaPage() {
  const [items, setItems] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setItems(await fetchAppointments());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-zinc-400">Carregando…</p>;

  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-white md:text-3xl">Agenda</h1>
      <p className="mt-1 text-zinc-400">Agendamentos solicitados (via WhatsApp / formulário)</p>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-12 text-center text-zinc-400">
              Nenhum agendamento registrado ainda.
            </CardContent>
          </Card>
        ) : (
          items.map((a) => (
            <Card key={a.id} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{a.clientName}</p>
                    <p className="text-sm text-zinc-400">{a.clientPhone}</p>
                    <p className="text-sm text-zinc-500">
                      {a.date} {a.time} • {a.status}
                    </p>
                  </div>
                  {a.notes && <p className="text-sm text-zinc-400">{a.notes}</p>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
