import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Clock3, ExternalLink, Heart, Instagram, MapPin, Menu, MessageCircle, Phone, Quote, Sparkles, Star, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const galleryImages = Object.values(
  import.meta.glob('./assets/products/*.jpg', { eager: true, import: 'default' }),
) as string[];

const categories = [
  { id: 'resin', label: 'Resin & candlelight', kicker: '01', title: 'Made to glow', text: 'Hand-poured candles and resin pieces, cast slowly so every keepsake catches the light a little differently.', art: 'art-basket', items: ['Handmade candles', 'Resin key-rings & bookmarks', 'Gypsum pots & showpieces'] },
  { id: 'art', label: 'Canvas & wall art', kicker: '02', title: 'Framed with feeling', text: 'Painted, folded, and pieced together by hand — art for the walls and mirrors that hold your everyday.', art: 'art-diya', items: ['Canvas paintings', 'Decorative mirror art', 'Art & photo frames'] },
  { id: 'gifts', label: 'Custom gifts & décor', kicker: '03', title: 'Made for your story', text: 'Quilling, mandala, and Areca-leaf art alongside custom orders — tell us the occasion, we shape the rest.', art: 'art-box', items: ['Quilling & mandala art', 'Areca leaf art', 'Custom gift orders'] },
];

const notes = [
  { quote: 'The kind of shop where you walk in for one thing and leave with a story. Everything feels chosen, not stocked.', name: 'Nusrat A.', detail: 'Local guide · Rajshahi' },
  { quote: 'I found the loveliest little brass bowl for my mother. The team wrapped it so beautifully too.', name: 'Farhana K.', detail: 'Repeat visitor' },
  { quote: 'A quiet gem near the city centre. Their handmade pieces bring so much warmth to our home.', name: 'Tanvir R.', detail: 'Neighbourhood customer' },
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    const el = document.querySelector(`[data-reveal="${className}"]`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [className]);
  return <div data-reveal={className} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label"><span className="section-dot" />{children}</p>;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand ${light ? 'brand-light' : ''}`} data-testid="link-brand">
      <span className="brand-mark">C</span>
      <span><strong>Chitrangada</strong><small>craft store · Rajshahi</small></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Collection', '#collection'], ['Gallery', '#gallery'], ['The story', '#story'], ['Visit us', '#visit']];
  return (
    <header className="site-header" data-testid="site-header">
      <Logo />
      <nav className={`site-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
        <a href="tel:01739732081" className="nav-call" data-testid="link-call-header"><Phone size={14} /> 01739-732081</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-menu">
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-wrap" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" />A small shop with a generous heart</div>
        <h1>Made by hand.<br /><em>Found</em> in Rajshahi.</h1>
        <p className="hero-intro">A thoughtful collection of handmade craft, gathered for homes that leave room for wonder.</p>
        <ul className="hero-tags" aria-label="What we make">
          <li>🎨 Resin art</li>
          <li>🌸 Floral designs</li>
          <li>🏡 Home décor</li>
          <li>🎁 Custom gifts</li>
          <li>🕯️ Candles</li>
          <li>🖼️ Canvas art</li>
        </ul>
        <div className="hero-actions">
          <a href="#collection" className="button button-primary" data-testid="link-explore-collection">Explore the collection <ArrowDownRight size={17} /></a>
          <a href="tel:01739732081" className="text-link" data-testid="link-call-hero"><Phone size={16} /> Call the shop</a>
        </div>
        <div className="hero-meta">
          <div className="rating" data-testid="text-rating"><span className="rating-stars"><Star size={13} fill="currentColor" /> 5.0</span><span>from 10 local notes</span></div>
          <div className="open-status" data-testid="status-closed"><span className="status-dot" /> Closed · opens at 4 PM</div>
        </div>
        <div className="hero-notes" data-testid="text-hero-notes"><span>📦 Delivery all over Bangladesh</span><span>📩 Custom orders welcome</span></div>
      </div>
      <div className="hero-art">
        <div className="hero-image">
          <img src="/chitrangada-hero.jpg" alt="Handmade terracotta and brass craft pieces" data-testid="img-hero-crafts" />
          <div className="image-caption"><span>01 / 03</span><span>things made slowly</span></div>
        </div>
        <div className="stamp">HAND<br />PICKED<br /><span>in BD</span></div>
        <div className="hero-side-note"><span>24° 22′ N</span><span>Rajshahi</span></div>
      </div>
      <div className="hero-scroll"><span>Scroll to wander</span><ArrowDownRight size={15} /></div>
    </section>
  );
}

function Collection() {
  const [selected, setSelected] = useState('everyday');
  const active = categories.find((category) => category.id === selected) ?? categories[0];
  return (
    <section className="collection section-wrap" id="collection">
      <Reveal className="collection-heading">
        <SectionLabel>What we keep on the shelves</SectionLabel>
        <div className="split-heading"><h2>Useful things,<br /><em>made memorable.</em></h2><p>Our shelves change with the hands that make them. Browse a few of the worlds we love to bring together.</p></div>
      </Reveal>
      <div className="category-tabs" role="tablist" aria-label="Craft categories">
        {categories.map((category) => <button key={category.id} role="tab" aria-selected={selected === category.id} className={selected === category.id ? 'active' : ''} onClick={() => setSelected(category.id)} data-testid={`button-category-${category.id}`}><span>{category.kicker}</span>{category.label}<ChevronRight size={15} /></button>)}
      </div>
      <div className="feature-category" data-testid={`panel-category-${active.id}`}>
        <div className={`category-art ${active.art}`}><div className="art-circle" /><div className="art-shape art-shape-one" /><div className="art-shape art-shape-two" /><span className="art-caption">handmade / one of a kind</span></div>
        <div className="category-copy"><span className="mono-kicker">{active.kicker} / collection note</span><h3>{active.title}</h3><p>{active.text}</p><ul>{active.items.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul><a href="#visit" className="text-link">Ask what’s in today <ArrowUpRight size={16} /></a></div>
      </div>
      <Reveal className="shelf-row">
        <div className="shelf-intro"><span className="mono-kicker">A closer look</span><h3>Little details.<br /><em>Big feeling.</em></h3></div>
        <div className="mini-card mini-card-yellow"><span className="mini-number">A</span><div className="mini-illustration illustration-bowl" /><p>Resin &amp; wax</p><small>candles and keepsakes, hand-poured</small></div>
        <div className="mini-card mini-card-teal"><span className="mini-number">B</span><div className="mini-illustration illustration-weave" /><p>Quilling &amp; mandala</p><small>paper and pattern, coiled by hand</small></div>
        <div className="mini-card mini-card-red"><span className="mini-number">C</span><div className="mini-illustration illustration-pot" /><p>Areca leaf art</p><small>shaped from natural leaf</small></div>
      </Reveal>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery section-wrap" id="gallery">
      <Reveal className="gallery-heading">
        <SectionLabel>Fresh off the shelves</SectionLabel>
        <div className="split-heading"><h2>A peek at what’s<br /><em>in the shop.</em></h2><p>Real pieces, photographed as they arrived — each one handmade, and no two quite alike.</p></div>
      </Reveal>
      <div className="gallery-grid">
        {galleryImages.map((src, index) => (
          <div className="gallery-item" key={src}>
            <img src={src} alt={`Handmade craft piece ${index + 1} at Chitrangada`} loading="lazy" data-testid={`img-gallery-${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="story-inner section-wrap">
        <Reveal className="story-copy"><SectionLabel>Why Chitrangada</SectionLabel><h2>A shop for the<br /><em>soft-hearted</em>.</h2><p>Chitrangada began with a simple belief: the things around us should carry a little of where we live. So we look for the quiet makers, the patient hands, and the pieces that get better with use. Turning simple spaces into beautiful stories, one handmade piece at a time.</p><p className="story-bn" lang="bn">একটি সৃজনশীল হস্তশিল্প উদ্যোগ যেখানে আমরা নিখুঁত হাতে গড়া আর্ট-পিস তৈরি করি ভালোবাসা আর সময় দিয়ে। আমাদের প্রতিটি পণ্যে থাকে মনের স্পর্শ, মমতার ছোঁয়া।</p><p className="story-signoff">Come for the craft. Stay for the feeling.</p><a href="#visit" className="button button-cream" data-testid="link-story-visit">Find your way here <ArrowUpRight size={17} /></a></Reveal>
        <Reveal className="story-card"><div className="story-card-top"><Sparkles size={19} /><span>From our shelves</span></div><div className="story-big-word">local<br /><em>love</em></div><div className="story-card-bottom"><span>01</span><span>Rajshahi, Bangladesh</span></div></Reveal>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section className="notes section-wrap" id="notes">
      <Reveal className="notes-heading"><SectionLabel>Kind words from nearby</SectionLabel><div className="split-heading"><h2>Passed from<br /><em>hand to hand.</em></h2><div><div className="big-rating"><Star size={24} fill="currentColor" /> 5.0</div><p>10 reviews · a little corner of the city, loved loudly.</p></div></div></Reveal>
      <div className="notes-grid">{notes.map((note, index) => <Reveal className={`note-card note-${index + 1}`} key={note.name}><Quote size={23} className="quote-icon" /><p>“{note.quote}”</p><div className="note-by"><span>{note.name}</span><small>{note.detail}</small></div></Reveal>)}</div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit section-wrap" id="visit">
      <Reveal className="visit-heading"><SectionLabel>Come by for a browse</SectionLabel><h2>Find us where<br /><em>the city slows down.</em></h2></Reveal>
      <div className="visit-grid">
        <div className="map-card" data-testid="map-card"><div className="map-grid" /><div className="map-road map-road-a" /><div className="map-road map-road-b" /><div className="map-road map-road-c" /><div className="map-pin"><MapPin size={22} fill="currentColor" /></div><div className="map-label">CHITRANGADA<br /><span>Pathan Para</span></div><div className="map-compass">N<br /><span>+</span></div><a href="https://www.google.com/maps/search/?api=1&query=Pathan+Para%2C+Opposite+of+Central+Eidgah%2C+Rajshahi%2C+Bangladesh+6000" target="_blank" rel="noreferrer" className="map-link" data-testid="link-directions">Open in Maps <ExternalLink size={14} /></a></div>
        <div className="visit-details"><div className="detail-row"><span className="detail-icon"><MapPin size={18} /></span><div><small>Our address</small><strong>Pathan Para, opposite Central Eidgah<br />Rajshahi, Bangladesh 6000</strong><a href="https://www.google.com/maps/search/?api=1&query=Pathan+Para%2C+Opposite+of+Central+Eidgah%2C+Rajshahi%2C+Bangladesh+6000" target="_blank" rel="noreferrer" data-testid="link-address">Get directions <ArrowUpRight size={15} /></a></div></div><div className="detail-row"><span className="detail-icon"><Clock3 size={18} /></span><div><small>Today at the shop</small><strong className="closed-copy">Currently closed</strong><span>Opens at 4 PM</span></div></div><div className="detail-row"><span className="detail-icon"><Phone size={18} /></span><div><small>Call or message</small><a href="tel:01739732081" className="phone-number" data-testid="link-phone-visit">01739-732081</a><span>We’d love to hear from you.</span></div></div><div className="detail-row"><span className="detail-icon"><Heart size={18} /></span><div><small>Delivery &amp; custom orders</small><strong>We deliver all over Bangladesh</strong><span>Custom designs and orders always welcome — just message us.</span></div></div><div className="visit-actions"><a href="tel:01739732081" className="button button-primary" data-testid="button-call-shop"><Phone size={16} /> Call the shop</a><a href="https://wa.me/8801739732081" target="_blank" rel="noreferrer" className="button button-outline" data-testid="button-message-shop"><MessageCircle size={16} /> Message us</a></div></div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top section-wrap"><Logo light /><p>Made slowly.<br />Found locally.</p><span className="footer-note">📦 Delivery all over Bangladesh · 📩 Custom orders welcome</span><a href="#top" className="back-top" data-testid="link-back-top">Back to top <ArrowUpRight size={16} /></a></div><div className="footer-bottom section-wrap"><span>© Chitrangada craft store</span><span>Pathan Para, Rajshahi, Bangladesh</span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" data-testid="link-instagram"><Instagram size={16} /> Follow along</a></div></footer>;
}

function Home() {
  return <main><Header /><Hero /><Collection /><Gallery /><Story /><Notes /><Visit /><Footer /></main>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;