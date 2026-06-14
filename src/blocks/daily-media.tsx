import { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, ExternalLink, PlayCircle, Trophy } from 'lucide-react';
import { m } from '@/paraglide/messages.js';
import { cn } from '@/lib/utils';

type MediaSlide =
  | {
      id: string;
      kind: 'image';
      src: string;
      label: string;
      note: string;
      source: string;
      alt: string;
      href?: string;
    }
  | {
      id: string;
      kind: 'video';
      src: string;
      poster: string;
      label: string;
      note: string;
      source: string;
    }
  | {
      id: string;
      kind: 'youtube';
      embedUrl: string;
      href: string;
      label: string;
      note: string;
      source: string;
    }
  | {
      id: string;
      kind: 'official';
      label: string;
      note: string;
      source: string;
      href: string;
      background: string;
      alt: string;
    };

export function DailyMedia() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const slides: MediaSlide[] = [
    {
      id: 'daily-image',
      kind: 'image',
      src: '/worldcup/media/daily-hero.jpg',
      label: m['worldcup.media.image_label'](),
      note: m['worldcup.media.image_note'](),
      source: 'CC0 / Wikimedia Commons',
      alt: m['worldcup.media.image_alt'](),
      href: 'https://commons.wikimedia.org/wiki/File:Well_lit_soccer_stadium_(Unsplash).jpg',
    },
    {
      id: 'stadium-aerial',
      kind: 'image',
      src: '/worldcup/media/stadium-aerial-cc0.jpg',
      label: m['worldcup.media.tactical_label'](),
      note: m['worldcup.media.tactical_note'](),
      source: 'CC0 / Wikimedia Commons',
      alt: m['worldcup.media.image_alt'](),
      href: 'https://commons.wikimedia.org/wiki/File:Drone_aerial_view_of_the_soccer_stadium_(Unsplash).jpg',
    },
    {
      id: 'official-youtube',
      kind: 'youtube',
      embedUrl: 'https://www.youtube-nocookie.com/embed/68Ov7NZNzfc?rel=0&modestbranding=1',
      href: 'https://www.youtube.com/watch?v=68Ov7NZNzfc',
      label: m['worldcup.media.video_label'](),
      note: m['worldcup.media.video_note'](),
      source: 'YouTube',
    },
    {
      id: 'official-video',
      kind: 'official',
      label: m['worldcup.media.official_label'](),
      note: m['worldcup.media.official_note'](),
      source: m['worldcup.media.source_official'](),
      href: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
      background: '/worldcup/media/stadium-aerial-cc0.jpg',
      alt: m['worldcup.media.image_alt'](),
    },
  ];
  const activeSlide = slides[activeIndex] ?? slides[0];

  function go(delta: number) {
    setActiveIndex((index) => (index + delta + slides.length) % slides.length);
  }

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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative aspect-[16/9] min-h-[260px] overflow-hidden rounded-lg border border-emerald-950/15 bg-zinc-950 shadow-sm">
            <MediaFrame
              slide={activeSlide}
              ready={!!ready[activeSlide.id]}
              failed={!!failed[activeSlide.id]}
              onReady={() => setReady((state) => ({ ...state, [activeSlide.id]: true }))}
              onFailed={() => setFailed((state) => ({ ...state, [activeSlide.id]: true }))}
            />

            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-lime-100 backdrop-blur">
              {activeSlide.source}
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center px-3">
              <button
                type="button"
                aria-label={m['worldcup.media.carousel_prev']()}
                onClick={() => go(-1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
              >
                <ChevronLeft className="size-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-3">
              <button
                type="button"
                aria-label={m['worldcup.media.carousel_next']()}
                onClick={() => go(1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {activeSlide.kind !== 'official' ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/84 to-transparent p-5 text-white">
                <p className="text-base font-semibold">{activeSlide.label}</p>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/70">{activeSlide.note}</p>
                {'href' in activeSlide && activeSlide.href ? (
                  <a
                    href={activeSlide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lime-200 hover:text-lime-100"
                  >
                    {m['worldcup.media.open_official']()}
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto pr-1 lg:grid-cols-1 lg:[scrollbar-width:thin]">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'min-h-24 rounded-lg border p-3 text-left transition-colors',
                  index === activeIndex
                    ? 'border-emerald-700 bg-emerald-950 text-lime-100'
                    : 'border-emerald-950/12 bg-white/70 text-emerald-950 hover:bg-white'
                )}
              >
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] opacity-60">
                  {slide.source}
                </span>
                <span className="mt-2 block text-sm font-bold leading-tight">{slide.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaFrame({
  slide,
  ready,
  failed,
  onReady,
  onFailed,
}: {
  slide: MediaSlide;
  ready: boolean;
  failed: boolean;
  onReady: () => void;
  onFailed: () => void;
}) {
  if (slide.kind === 'image') {
    return (
      <>
        {!failed ? (
          <img
            src={slide.src}
            alt={slide.alt}
            onLoad={onReady}
            onError={onFailed}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              ready ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : null}
        {!ready ? <MediaFallback icon="camera" /> : null}
      </>
    );
  }

  if (slide.kind === 'video') {
    return (
      <>
        {!failed ? (
          <video
            src={slide.src}
            poster={slide.poster}
            controls
            muted
            playsInline
            preload="metadata"
            onCanPlay={onReady}
            onError={onFailed}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              ready ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : null}
        {!ready ? <MediaFallback icon="play" /> : null}
      </>
    );
  }

  if (slide.kind === 'youtube') {
    return (
      <>
        <iframe
          src={slide.embedUrl}
          title={slide.label}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={onReady}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-500',
            ready ? 'opacity-100' : 'opacity-0'
          )}
        />
        {!ready ? <MediaFallback icon="play" /> : null}
      </>
    );
  }

  return (
    <>
      <img
        src={slide.background}
        alt={slide.alt}
        onLoad={onReady}
        onError={onFailed}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
          ready ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,8,0.9),rgba(3,10,8,0.5)_55%,rgba(3,10,8,0.88))]" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-md rounded-lg border border-white/15 bg-black/42 p-5 text-center text-white shadow-2xl shadow-black/25 backdrop-blur-md">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-lime-200/30 bg-lime-200/12 text-lime-100">
            <Trophy className="size-6" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-lime-100/70">
            FIFA.com
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight">{slide.label}</p>
          <p className="mt-3 text-sm leading-6 text-white/68">{slide.note}</p>
          <a
            href={slide.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-2 text-sm font-bold text-emerald-950 hover:bg-lime-200"
          >
            {m['worldcup.media.open_official']()}
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
      {!ready ? <MediaFallback icon="trophy" /> : null}
    </>
  );
}

function MediaFallback({ icon }: { icon: 'camera' | 'play' | 'trophy' }) {
  const Icon = icon === 'camera' ? Camera : icon === 'play' ? PlayCircle : Trophy;

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
      <div className="worldcup-ball absolute left-[18%] top-[48%] size-8 rounded-full shadow-lg shadow-lime-300/25" />
      <div className="worldcup-route absolute left-[18%] top-[52%] h-px w-[62%] bg-lime-300/70" />
    </div>
  );
}
