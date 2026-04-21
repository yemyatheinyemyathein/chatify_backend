import aj from "../lib/arcjet.ts";
import { isSpoofedBot } from "@arcjet/inspect";
import express from 'express'

export const arcjetProtection = async (req: express.Request, res: express.Response, next: () => void) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }

    if(decision.results.some(isSpoofedBot)){
        return res.status(403).json({
            error:"Spoofed bot detected",
            message: "Malicious bot activity detected."
        })
    }
  } catch (error) {
    console.log("Arcjet Protection Error: ", error);
    next();
  }
};
