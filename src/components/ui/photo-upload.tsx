'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

// Curated avatar presets for students and educators
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberStudent1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberMentor2',
];

export function PhotoUpload({
  value,
  onChange,
  name = 'User',
  size = 'md',
  label = 'Profile Photo',
  className,
}: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-14 h-14 text-base',
    md: 'w-24 h-24 text-xl',
    lg: 'w-32 h-32 text-3xl',
  };

  const compressAndConvertImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 360;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(e.target?.result as string);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid File', description: 'Please select an image file (PNG, JPG, WebP)', variant: 'destructive' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Please select an image under 8MB', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const dataUrl = await compressAndConvertImage(file);
      onChange(dataUrl);
      toast({ title: 'Photo Selected! 📸', description: 'Profile picture updated successfully.' });
    } catch {
      toast({ title: 'Upload Failed', description: 'Could not process the selected image.', variant: 'destructive' });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="text-xs font-semibold text-slate-700 block">{label}</label>}

      <div className="flex flex-wrap items-center gap-4">
        {/* Avatar Display */}
        <div className="relative group">
          <div
            className={cn(
              'rounded-3xl overflow-hidden border-2 border-slate-200/80 shadow-md bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
              sizeClasses[size]
            )}
          >
            {value ? (
              <img
                src={value}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => onChange(null)}
              />
            ) : (
              <span>{initials}</span>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg transition-transform active:scale-90 border-2 border-white"
            title="Upload photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="text-xs font-semibold rounded-xl h-9"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
            Upload Photo
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="text-xs font-medium rounded-xl h-9 text-slate-600 hover:text-brand-600"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Choose Avatar
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="text-xs font-medium rounded-xl h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Preset Avatars Drawer */}
      {showPresets && (
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl animate-in fade-in duration-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Choose a ready avatar:</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {AVATAR_PRESETS.map((avatarUrl, idx) => {
              const isSelected = value === avatarUrl;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(avatarUrl);
                    setShowPresets(false);
                  }}
                  className={cn(
                    'w-12 h-12 rounded-xl overflow-hidden border-2 transition-all relative group flex items-center justify-center bg-white',
                    isSelected ? 'border-brand-600 scale-105 shadow-md ring-2 ring-brand-400/30' : 'border-slate-200 hover:border-brand-400'
                  )}
                >
                  <img src={avatarUrl} alt="Preset" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
