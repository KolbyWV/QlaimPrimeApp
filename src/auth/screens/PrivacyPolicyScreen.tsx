import React from "react";

import { Body, Heading, Screen, SectionTitle } from "../../ui/components";
import { useAppTheme } from "../../ui/theme";

export function PrivacyPolicyScreen() {
  const { theme } = useAppTheme();

  return (
    <Screen scroll contentStyle={{ paddingBottom: 36 }}>
      <Heading style={{ marginBottom: 6 }}>Privacy Policy</Heading>
      <Body style={{ marginBottom: 18 }}>
        Effective date: March 10, 2026. This Privacy Policy explains how 3D2Y Venture Company collects, uses, and
        protects information in Qlaim.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Information We Collect</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        We collect account information (such as email), profile details, assignment and gig activity, submitted proof
        photos, and technical/app usage data needed to operate and secure the service.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>How We Use Information</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        We use information to provide core app features, authenticate users, manage gigs and assignments, process
        payouts and rewards, prevent fraud, and improve platform reliability.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Data Sharing</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        We may share limited information with service providers who help run Qlaim and with counterparties required to
        fulfill platform activity. We do not sell your personal data.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Data Retention and Security</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        We retain data only as needed for business and legal requirements and use reasonable safeguards to protect
        account and platform data.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Your Choices</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        You may request updates to your account details and may stop using the app at any time. Some data may still be
        retained where legally required.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Policy Updates</SectionTitle>
      <Body>
        We may update this policy periodically. Continued use of Qlaim after updates means you accept the revised
        Privacy Policy.
      </Body>
    </Screen>
  );
}
