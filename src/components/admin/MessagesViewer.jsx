import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, MessageSquare, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';

export default function MessagesViewer({ messages }) {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['messages'] }); setSelectedMessage(null); },
  });

  const handleSelect = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) markReadMutation.mutate(msg.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contact Messages</h2>
        <p className="text-sm text-muted-foreground mt-1">Messages from visitors</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                  selectedMessage?.id === msg.id
                    ? 'border-[#8B1A1A] bg-[#8B1A1A]/5 shadow-md'
                    : !msg.read
                      ? 'border-[#8B1A1A]/20 bg-[#8B1A1A]/[0.03]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{msg.name}</h3>
                      {!msg.read && <span className="w-2.5 h-2.5 bg-[#8B1A1A] rounded-full animate-pulse" />}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {msg.email}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-2">{msg.subject || msg.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.created_date ? format(new Date(msg.created_date), 'MMM d') : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">{selectedMessage.name}</h3>
                <a href={`mailto:${selectedMessage.email}`} className="text-[#8B1A1A] hover:underline text-sm">{selectedMessage.email}</a>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedMessage.created_date ? format(new Date(selectedMessage.created_date), 'MMMM d, yyyy h:mm a') : ''}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => deleteMutation.mutate(selectedMessage.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            {selectedMessage.subject && (
              <div className="mb-4 p-3 bg-[hsl(var(--muted))] rounded-xl">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Subject</Label>
                <p className="font-medium text-sm mt-1">{selectedMessage.subject}</p>
              </div>
            )}
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Message</Label>
              <p className="whitespace-pre-wrap text-sm mt-2 leading-relaxed">{selectedMessage.message}</p>
            </div>
            <div className="mt-6">
              <Button asChild className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-xl">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}>
                  <Mail className="w-4 h-4 mr-2" /> Reply via Email
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
