import { useTranslation } from "react-i18next";
import {DisclaimerSection} from "@/components/Layout/DisclaimerSection";
import {PageHeader} from "@/components/Layout/PageHeader";

export default function Disclaimer() {
    const { t } = useTranslation();

    return (
        <main className="disclaimer">
            <PageHeader title={t("DISCLAIMER")} subtitle={t("LEGAL")}/>
            <DisclaimerSection />
        </main>
    );
};

