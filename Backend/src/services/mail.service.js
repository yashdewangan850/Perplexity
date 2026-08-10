const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail({ to, subject, html, text }) {
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Perplexity <onboarding@resend.dev>",
                to: [to],
                subject,
                html,
                text,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend email error:", data);
            throw new Error(data.message || "Failed to send email");
        }

        console.log("Email sent successfully:", data);

        return data;

    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}