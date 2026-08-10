const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendEmail({ to, subject, html, text }) {
    try {
        console.log("Sending email to:", to);

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: [to],
                subject,
                html,
                text,
            }),
        });

        const data = await response.json();

        console.log("Resend status:", response.status);
        console.log("Resend response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Resend email failed");
        }

        console.log("Email sent successfully:", data.id);

        return data;

    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}