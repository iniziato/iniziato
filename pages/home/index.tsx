import {Hero} from "@/components/Layout/Hero";
import {IntroSection} from "@/components/Layout/IntroSection";
import {InstructorSection} from "@/components/Layout/InstructorSection";
import {PricingSection} from "@/components/Layout/PricingSection";
import {ClassesSection} from "@/components/Layout/ClassesSection";
import {withTranslations} from "@/lib/auth";

export default function Home() {

    return (
        <main className="home">
            <Hero />
            <IntroSection />
            <ClassesSection />
            <InstructorSection />
            <PricingSection />
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}