import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Clock3, ExternalLink, Heart, MapPin, Menu, MessageCircle, Phone, Quote, Sparkles, Star, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import heroImage from '@/assets/chitrangada-hero.jpg';

const queryClient = new QueryClient();

const galleryImages = Object.values(
  import.meta.glob('./assets/products/*.jpg', { eager: true, import: 'default' }),
) as string[];

const categories = [
  { id: 'resin', label: 'Resin & candlelight', kicker: '01', title: 'Made to glow', text: 'Hand-poured candles and resin pieces, cast slowly so every keepsake catches the light a little differently.', art: 'art-basket', items: ['Handmade candles', 'Resin key-rings & bookmarks', 'Gypsum pots & showpieces'] },
  { id: 'art', label: 'Canvas & wall art', kicker: '02', title: 'Framed with feeling', text: 'Painted, folded, and pieced together by hand — art for the walls and mirrors that hold your everyday.', art: 'art-diya', items: ['Canvas paintings', 'Decorative mirror art', 'Art & photo frames'] },
  { id: 'gifts', label: 'Custom gifts & décor', kicker: '03', title: 'Made for your story', text: 'Quilling, mandala, and Areca-leaf art alongside custom orders — tell us the occasion, we shape the rest.', art: 'art-box', items: ['Quilling & mandala art', 'Areca leaf art', 'Custom gift orders'] },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'Instagram', href: 'https://www.instagram.com/', path: 'M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' },
  { name: 'Pinterest', href: 'https://www.pinterest.com/', path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.607 0 11.985-5.365 11.985-11.985C24.002 5.367 18.624.001 12.017.001z' },
  { name: 'YouTube', href: 'https://www.youtube.com/', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'TikTok', href: 'https://www.tiktok.com/', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  { name: 'X', href: 'https://x.com/', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
];

function SocialIcon({ path }: { path: string }) {
  return <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path} /></svg>;
}

function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`social-links ${className}`} aria-label="Follow us on social media">
      {socialLinks.map((social) => (
        <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name} title={social.name} data-testid={`link-${social.name.toLowerCase()}`}>
          <SocialIcon path={social.path} />
        </a>
      ))}
    </div>
  );
}

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
          <img src={heroImage} alt="Handmade terracotta and brass craft pieces" data-testid="img-hero-crafts" />
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
  return <footer className="site-footer"><div className="footer-top section-wrap"><Logo light /><p>Made slowly.<br />Found locally.</p><span className="footer-note">📦 Delivery all over Bangladesh · 📩 Custom orders welcome</span><a href="#top" className="back-top" data-testid="link-back-top">Back to top <ArrowUpRight size={16} /></a></div><div className="footer-bottom section-wrap"><span>© Chitrangada craft store</span><span>Pathan Para, Rajshahi, Bangladesh</span><SocialLinks /></div></footer>;
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