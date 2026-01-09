"use client";

import { useTranslation } from "react-i18next";
import styles from "./PaymentForm.module.scss";

type Props = {
    plan: "monthly" | "quarterly";
    cardNumber: string;
    setCardNumber: (v: string) => void;
    expiry: string;
    setExpiry: (v: string) => void;
    cvc: string;
    setCvc: (v: string) => void;
    errors: any;
};

export default function PaymentForm({ plan, cardNumber, setCardNumber, expiry, setExpiry, cvc, setCvc, errors }: Props) {
    const { t } = useTranslation();
    const total = plan === "monthly" ? "₾79.00" : "₾209.00";

    return (
        <div className={styles.paymentWrapper}>
            <h2>{t("PAYMENT_TITLE")}</h2>
            <div className={styles.cardGroup}>
                <input type="text" placeholder={t("PAYMENT_CARD_NUMBER")} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                {errors.cardNumber && <div className={styles.authTemplateError}>{errors.cardNumber}</div>}

                <input type="text" placeholder={t("PAYMENT_EXPIRY")} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                {errors.expiry && <div className={styles.authTemplateError}>{errors.expiry}</div>}

                <input type="text" placeholder={t("PAYMENT_CVC")} value={cvc} onChange={(e) => setCvc(e.target.value)} />
                {errors.cvc && <div className={styles.authTemplateError}>{errors.cvc}</div>}
            </div>

            <div className={styles.summary}>
                <span>{t("PAYMENT_TODAY_PAY")}</span>
                <strong>{total}</strong>
            </div>
        </div>
    );
}
