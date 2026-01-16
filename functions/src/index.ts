import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const notImplemented = (name: string) =>
  onRequest((req, res) => {
    res.status(501).json({
      error: "not_implemented",
      function: name,
      message: "This endpoint is scaffolded only.",
      method: req.method,
    });
  });

export const generateInitialDraft = notImplemented("generateInitialDraft");
export const reviseDraft = notImplemented("reviseDraft");
export const createReferralLink = notImplemented("createReferralLink");
export const verifyReferralLink = notImplemented("verifyReferralLink");
export const generateReferralVariants = notImplemented("generateReferralVariants");
export const surgicalRevision = notImplemented("surgicalRevision");
export const generateReviewReply = notImplemented("generateReviewReply");
