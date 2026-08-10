const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail({ to, subject, html, text }) {
    try {
        console.log("1. Sending email to:", to);
        console.log("2. Resend API key exists:", !!RESEND_API_KEY);

        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is missing");
        }

        console.log("3. Calling Resend API...");

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: [to],
                subject,
                html,
                text,
            }),
            signal: AbortSignal.timeout(15000),
        });

        console.log("4. Resend API responded");

        const data = await response.json();

        console.log("5. Resend status:", response.status);
        console.log("6. Resend response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Resend email failed"
            );
        }

        console.log(
            "7. Email sent successfully:",
            data.id
        );

        return data;

    } catch (error) {
        console.error("EMAIL ERROR:", error);
        throw error;
    }
}