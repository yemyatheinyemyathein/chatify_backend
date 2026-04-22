import { resendClient, sender } from "../lib/resend.ts";
import { createWelcomeEmailTemplates } from "./emailTemplates.ts";
export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        subject: "Welcome to Chatify!",
        to: [email], // Resend usually expects an array or a single string
        html: createWelcomeEmailTemplates(name, clientURL)
    });
    if (error) {
        console.error("Error sending welcome email: ", error);
        throw new Error("Failed to send welcome email");
    }
    console.log("Welcome email sent successfully ", data);
};
