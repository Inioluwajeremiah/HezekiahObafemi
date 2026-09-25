import Image from "next/image";
import { memorial } from "@/memorial.config";
import { listCondolences } from "@/lib/store";
import CondolenceForm from "./CondolenceForm";

export const dynamic = "force-dynamic";

function Photo({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="photo">
      <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" priority={priority} />
    </div>
  );
}

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function Home() {
  const entries = await listCondolences();
  const [portrait, ...rest] = memorial.photos;

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">In loving memory of</p>
        <div className="wreath">
          <h1>{memorial.name}</h1>
          <p className="dates">{memorial.born} — {memorial.died}</p>
        </div>
        <div className="rule" />
        <p className="tribute">{memorial.tribute}</p>
      </header>

      <section className="gallery" aria-label="Photographs">
        <div className="portrait"><Photo src={portrait} alt={memorial.name} priority /></div>
        {rest.map((src, i) => (
          <div className="thumb" key={src}><Photo src={src} alt={`${memorial.name}, photo ${i + 2}`} /></div>
        ))}
      </section>

      <section className="sign">
        <h2>Sign the Condolence Register</h2>
        <CondolenceForm />
      </section>

      <section className="register">
        <h2>Messages <span className="count">{entries.length}</span></h2>
        {entries.length === 0 ? (
          <p className="empty">Be the first to leave a message.</p>
        ) : (
          <ul>
            {entries.map((e) => (
              <li key={e.id}>
                <p className="message">{e.message}</p>
                <p className="by">— {e.name} <time dateTime={e.createdAt}>{fmt.format(new Date(e.createdAt))}</time></p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>Forever in our hearts.</footer>
    </main>
  );
}
