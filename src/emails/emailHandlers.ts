import {resendClient, sender } from "../lib/resend.ts"
import { createWelcomeEmailTemplates } from "./emailTemplates.ts"

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        subject: "Welcome to Chatify!",
        to: email,
        html: createWelcomeEmailTemplates(name, clientURL)
    })

    if (error) {
        console.error("Error sending welcome email: ", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome email sent successfully ", data);
}