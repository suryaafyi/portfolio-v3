import DotField from "@/components/DotField";
import Stickers from "@/components/Stickers";
import Hero from "@/components/Hero";
import DockNav from "@/components/DockNav";
import Cursor from "@/components/Cursor";
import HuntSticker from "@/components/hunt/HuntSticker";
import SplashIntro from "@/components/splash/SplashIntro";

export default function Home() {
  return (
    <>
      <DotField />
      <Stickers />
      <Hero />
      <HuntSticker id="home" className="hunt-spot-home" />
      <DockNav />
      <SplashIntro />
      <Cursor />
    </>
  );
}
