import nodemailer from "nodemailer";
import {env} from "../config/env";

const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
    },
});



export async function sendVerificationEmail(email: string, verificationLink: string) {
    await transporter.sendMail({
        from: env.smtpFrom,
        to: email,
        subject: "Bitte bestätige dein Konto",
        html: `
            <p>Hallo,</p>
            <p>bitte bestätige dein Konto, indem du auf den folgenden Link klickst:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Wenn du dich nicht registriert hast, kannst du diese E-Mail ignorieren.</p>
        `
    });
}