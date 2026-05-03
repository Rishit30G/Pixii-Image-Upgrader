'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Download, Sparkles, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { RainbowButton } from './ui/rainbow-button';
import { Label } from './ui/label';

type OutputState = 'idle' | 'loading' | 'result';

export function PhotoUpgrader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [outputState, setOutputState] = useState<OutputState>('idle');
  const [resultImage, setResultImage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const error = fileRejections[0].errors[0];
        if (error.code === 'file-invalid-type') {
          toast.error('File not supported. Please upload a JPG or PNG image.');
        } else if (error.code === 'file-too-large') {
          toast.error('File too large. Maximum size is 4MB.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        // Validate file size (4MB max) fallback
        if (file.size > 4 * 1024 * 1024) {
          toast.error('File too large. Maximum size is 4MB.');
          return;
        }
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    []
  );

  const removeImage = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setUploadedFile(null);
    setPreview(null);
    setOutputState('idle');
    setResultImage(null);
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    disabled: !!uploadedFile,
  });

  // Enhance is available as soon as an image is uploaded (default prompt exists)
  const canSubmit = !!uploadedFile;

  const handleEnhance = useCallback(async () => {
    if (!uploadedFile) return;

    setOutputState('loading');
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Only send prompt if user typed something — API route uses default otherwise
      if (prompt.trim()) {
        formData.append('prompt', prompt.trim());
      }

      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Enhancement failed');
      }

      if (!data.url) {
        throw new Error('No result image URL received');
      }

      setResultImage(data.url);
      setOutputState('result');
      toast.success('Image enhanced successfully!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(message);
      setOutputState('idle');
    }
  }, [uploadedFile, prompt]);

  const handleDownload = useCallback(async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enhanced-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(resultImage, '_blank');
    }
  }, [resultImage]);

  const motionStyle = useMemo(() => ({ willChange: 'transform' as const }), []);

  return (
    <div className="mx-auto max-w-5xl bg-background p-10">
      <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* ── Left Grid: Upload & Prompt ── */}
        <div className="flex flex-col gap-4">
          {/* Dropzone */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={motionStyle}
                  className="relative aspect-square w-full overflow-hidden rounded-xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic blob URL from user upload */}
                  <img
                    src={preview}
                    alt="Uploaded preview"
                    className="size-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2.5 top-2.5 rounded-xl bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={removeImage}
                    disabled={outputState === 'loading'}
                  >
                    <X data-icon="inline-start" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    {...getRootProps()}
                    className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
                      isDragActive
                        ? 'border-foreground/30 bg-muted/60'
                        : 'border-muted-foreground/20 bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="size-8" />
                      <p className="text-sm font-medium">
                        {isDragActive
                          ? 'Drop your image here'
                          : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        PNG, JPG up to 4MB
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Label className="!-mb-2 px-2 mt-2">Optional Prompt</Label>
          <Textarea
            placeholder="Describe how you want to enhance this photo..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 resize-none rounded-xl bg-background"
            disabled={outputState === 'loading'}
          />

          {/* Enhance Button */}
          <div className="flex justify-center">
            <Button
              className="w-40 rounded-full text-base py-5 cursor-pointer shadow-xl"
              size="lg"
              disabled={!canSubmit || outputState === 'loading'}
              onClick={handleEnhance}
            >
              <Sparkles data-icon="inline-start" className="animate-pulse" />
              {outputState === 'loading' ? 'Enhancing...' : 'Enhance'}
            </Button>
          </div>
        </div>

        {/* ── Right Grid: Output ── */}
        <div className="flex flex-col gap-8">
          {/* Output area */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {outputState === 'idle' && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl bg-muted/50 border-2 border-border"
                >
                  <ImageIcon className="size-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground/50">
                    Your enhanced image will appear here
                  </p>
                </motion.div>
              )}

              {outputState === 'loading' && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Skeleton className="aspect-square w-full rounded-xl" />
                </motion.div>
              )}

              {outputState === 'result' && resultImage && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={motionStyle}
                  className="aspect-square w-full overflow-hidden rounded-xl shadow-2xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic external URL from Claid API */}
                  <img
                    src={resultImage}
                    alt="Enhanced result"
                    className="size-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Download Button */}
          <AnimatePresence>
            {outputState === 'result' && resultImage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex items-center justify-center"
              >
                <RainbowButton
                  className="w-60 rounded-full text-base"
                  size="lg"
                  onClick={handleDownload}
                >
                  <Download data-icon="inline-start" />
                  Download
                </RainbowButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
