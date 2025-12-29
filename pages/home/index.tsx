import {Hero} from "@/components/Layout/Hero";
import {IntroSection} from "@/components/Layout/IntroSection";
import {InstructorSection} from "@/components/Layout/InstructorSection";
import {PricingSection} from "@/components/Layout/PricingSection";
import {ClassesSection} from "@/components/Layout/ClassesSection";

export default function Home() {

    return (
        <main className="home">
            <Hero />
            <IntroSection />
            <ClassesSection />
            <InstructorSection />
            <PricingSection />
        </main>
    )
}
