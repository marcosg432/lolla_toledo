"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Service } from "@/lib/db";

export function AgendarForm({ services }: { services: Service[] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const service = services.find((s) => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá, Lolla! Gostaria de agendar um atendimento.

Nome: ${name}
WhatsApp: ${phone}
Serviço desejado: ${service ? service.name : "-"}
Data preferida: ${date || "-"}
Horário preferido: ${time || "-"}
Observação: ${notes || "-"}

Enviado pelo site oficial Lolla Toledo Mega Hair.`;
    const url = `https://api.whatsapp.com/send?phone=5567992964308&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSent(true);
    setName("");
    setPhone("");
    setDate("");
    setTime("");
    setNotes("");
  };

  if (sent) {
    return (
      <Card className="border-[#7B2433]/60 bg-[#3B1F1A]/80 shadow-dark-warm">
        <CardContent className="p-10 text-center">
          <p className="font-playfair text-xl font-semibold text-[#C98A48]">Mensagem encaminhada!</p>
          <p className="mt-3 text-[#E2B07E]/90">
            Você será redirecionada para o WhatsApp. Confirme o envio e aguarde nosso retorno para confirmar o horário.
          </p>
          <Button className="mt-8 btn-premium" onClick={() => setSent(false)}>
            Enviar outro agendamento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-playfair text-2xl font-semibold text-[#C98A48]">Solicitar agendamento</h2>
        <p className="text-[#E2B07E]/90">Preencha e envie para abrir o WhatsApp com os dados.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="border-[#7B2433]/50 bg-[#3B1F1A] text-[#E2B07E] placeholder:text-[#E2B07E]/50 focus-visible:ring-[#A55B35] focus-visible:ring-offset-[#1E1412]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
                className="border-[#7B2433]/50 bg-[#3B1F1A] text-[#E2B07E] placeholder:text-[#E2B07E]/50 focus-visible:ring-[#A55B35] focus-visible:ring-offset-[#1E1412]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Serviço</Label>
            <select
              id="service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="flex h-11 w-full rounded-xl border-2 border-[#7B2433]/50 bg-[#3B1F1A] px-4 py-2 text-base text-[#E2B07E] focus:outline-none focus:ring-2 focus:ring-[#A55B35] focus:ring-offset-2 focus:ring-offset-[#1E1412] focus:border-[#A55B35]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#3B1F1A] text-[#E2B07E]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data preferida</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-[#7B2433]/50 bg-[#3B1F1A] text-[#E2B07E] focus-visible:ring-[#A55B35] focus-visible:ring-offset-[#1E1412]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário preferido</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-[#7B2433]/50 bg-[#3B1F1A] text-[#E2B07E] focus-visible:ring-[#A55B35] focus-visible:ring-offset-[#1E1412]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observação</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alguma preferência ou dúvida?"
              rows={3}
              className="flex w-full rounded-xl border-2 border-[#7B2433]/50 bg-[#3B1F1A] px-4 py-2 text-base text-[#E2B07E] placeholder:text-[#E2B07E]/50 focus:outline-none focus:ring-2 focus:ring-[#A55B35] focus:ring-offset-2 focus:ring-offset-[#1E1412] focus:border-[#A55B35]"
            />
          </div>
          <Button type="submit" size="lg" className="w-full btn-premium">
            Enviar e abrir WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
