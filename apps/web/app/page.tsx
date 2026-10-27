import Nav from "@/components/site/nav";
import Hero from "@/components/site/hero";
import Manifesto from "@/components/site/manifesto";
import Stages from "@/components/site/stages";
import Workflow from "@/components/site/workflow";
import Architecture from "@/components/site/architecture";
import Closing from "@/components/site/closing";
import Footer from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="mx-auto w-full max-w-[1240px] border-x border-line">
        <main>
          <Hero />
          <Manifesto />
          <Stages />
          <Workflow />
          <Architecture />
          <Closing />
        </main>
        <Footer />
      </div>
    </>
  );
}