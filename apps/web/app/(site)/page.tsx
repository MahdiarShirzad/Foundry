import Hero from "@/components/site/hero";
import Manifesto from "@/components/site/manifesto";
import Stages from "@/components/site/stages";
import Workflow from "@/components/site/workflow";
import Architecture from "@/components/site/architecture";
import Closing from "@/components/site/closing";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Stages />
      <Workflow />
      <Architecture />
      <Closing />
    </>
  );
}