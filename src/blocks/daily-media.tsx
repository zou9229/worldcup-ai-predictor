import { useState } from 'react';
import { Camera, PlayCircle } from 'lucide-react';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

const DAILY_IMAGE = '/worldcup/media/daily-hero.jpg';
const DAILY_VIDEO = '/worldcup/media/daily-highlight.mp4';
const DAILY_POSTER = '/worldcup/media/daily-highlight-poster.jpg';

export function DailyMedia() {
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="bg-[#edf4ed] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800/70">
              {m['worldcup.media.badge']()}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
              {m['worldcup.media.title']()}
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-emerald-950/62">
            {m['worldcup.media.description']()}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-emerald-950/15 bg-zinc-950 shadow-sm">
            {!imageFailed ? (
              <img
                src={DAILY_IMAGE}
                alt={m['worldcup.media.image_alt']()}
                onLoad={() => setImageReady(true)}
                onError={() => setImageFailed(true)}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                  imageReady ? 'opacity-100' : 'opacity-0'
                )}
              />
            ) : null}
            {!imageReady ? <MediaFallback icon="camera" /> : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 to-transparent p-5 text-white">
              <p className="text-sm font-semibold">{m['worldcup.media.image_label']()}</p>
              <p className="mt-1 text-xs text-white/68">{m['worldcup.media.image_note']()}</p>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-emerald-950/15 bg-zinc-950 shadow-sm">
            {!videoFailed ? (
              <video
                src={DAILY_VIDEO}
                poster={DAILY_POSTER}
                controls
                muted
                playsInline
                preload="metadata"
                onCanPlay={() => setVideoReady(true)}
                onError={() => setVideoFailed(true)}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                  videoReady ? 'opacity-100' : 'opacity-0'
                )}
              />
            ) : null}
            {!videoReady ? <MediaFallback icon="play" /> : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 to-transparent p-5 text-white">
              <p className="text-sm font-semibold">{m['worldcup.media.video_label']()}</p>
              <p className="mt-1 text-xs text-white/68">{m['worldcup.media.video_note']()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaFallback({ icon }: { icon: 'camera' | 'play' }) {
  const Icon = icon === 'camera' ? Camera : PlayCircle;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(190,242,100,0.28),transparent_28%),linear-gradient(135deg,#020617,#102018_52%,#020617)]">
      <div className="absolute inset-x-8 bottom-[-18%] h-2/3 rounded-[50%] border border-white/22 bg-emerald-500/10 [transform:perspective(520px)_rotateX(58deg)]">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/18" />
        <div className="absolute left-[16%] top-0 h-full w-px bg-white/10" />
        <div className="absolute right-[16%] top-0 h-full w-px bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/18" />
      </div>
      <div className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lime-200 backdrop-blur">
        <Icon className="size-5" />
      </div>
      <div className="worldcup-stadium-lights absolute inset-x-0 top-0 h-24 opacity-70" />
    </div>
  );
}
