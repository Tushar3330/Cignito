import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9ef8780b26f86db59f0cd5218c0b4266@o4509430680584192.ingest.us.sentry.io/4509971887292416",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      isNameRequired: true,
      isEmailRequired: true,
    }),
  ],
});