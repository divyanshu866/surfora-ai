import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image src={"newlogo.svg"} width={35} height={35} alt="surforaAI logo" />

      <span className="text-[15px] font-semibold tracking-[-0.025em] text-white">
        <Image src={"name.svg"} width={70} height={60} alt="surforaAI logo" />
      </span>
    </div>
  );
}
