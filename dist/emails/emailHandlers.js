"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const resend_ts_1 = require("../lib/resend.ts");
const emailTemplates_ts_1 = require("./emailTemplates.ts");
const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resend_ts_1.resendClient.emails.send({
        from: `${resend_ts_1.sender.name} <${resend_ts_1.sender.email}>`,
        subject: "Welcome to Chatify!",
        to: email,
        html: (0, emailTemplates_ts_1.createWelcomeEmailTemplates)(name, clientURL)
    });
    if (error) {
        console.error("Error sending welcome email: ", error);
        throw new Error("Failed to send welcome email");
    }
    console.log("Welcome email sent successfully ", data);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
