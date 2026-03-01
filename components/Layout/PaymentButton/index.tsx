"use client"
import { useState } from "react"

type Item = {
    productId: string
    description: string
    quantity: number
    unitPrice: number
}

export default function PaymentButton({ items }: { items: Item[] }) {
    const [loading, setLoading] = useState(false)

    const handlePay = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            })

            const data = await res.json()

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl
            } else {
                alert(data.message || "გადახდა ვერ განხორციელდა")
            }
        } catch (err: any) {
            alert(`გადახდა ვერ განხორციელდა: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={handlePay} disabled={loading}>
        {loading ? "იტვირთება..." : "გადახდის განხორციელება"}
        </button>
)
}