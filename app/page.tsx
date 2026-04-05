import { ConfessionDeck } from "@/app/components/confession-deck";
import { confessions } from "@/app/confessions";

export default function Home() {
  return <ConfessionDeck entries={confessions} />;
}
