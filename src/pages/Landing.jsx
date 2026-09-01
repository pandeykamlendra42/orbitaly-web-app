import Hero from '../sections/Hero'
import Problems from '../sections/Problems'
import Pillars from '../sections/Pillars'
import PlanAndFund from '../sections/PlanAndFund'
import ExpertNetwork from '../sections/ExpertNetwork'
import Overseas from '../sections/Overseas'
import Roadmap from '../sections/Roadmap'
import TrustSummary from '../sections/TrustSummary'
import ThreeDoors from '../sections/ThreeDoors'

// One argument, made in order — which is why the sections are numbered on the
// page: what you're facing, the shape of the answer, the part that pays for
// it, what actually exists today, how we make money, how to get involved.
export default function Landing() {
  return (
    <main className="bg-paper">
      <Hero />
      <Problems />
      <Pillars />
      <PlanAndFund />
      <ExpertNetwork />
      <Overseas />
      <Roadmap />
      <TrustSummary />
      <ThreeDoors />
    </main>
  )
}
