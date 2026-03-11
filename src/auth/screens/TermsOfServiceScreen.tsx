import React from "react";

import { Body, Heading, Screen, SectionTitle } from "../../ui/components";
import { useAppTheme } from "../../ui/theme";

export function TermsOfServiceScreen() {
  const { theme } = useAppTheme();

  return (
    <Screen scroll contentStyle={{ paddingBottom: 36 }}>
      <Heading style={{ marginBottom: 6 }}>Terms of Service</Heading>
      <Body style={{ marginBottom: 18 }}>
        Effective date: March 10, 2026. These Terms govern your use of Qlaim, operated by 3D2Y Venture Company.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Eligibility and Accounts</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        You must provide accurate account information and keep your login credentials secure. You are responsible for
        activity under your account.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Platform Use</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        Qlaim connects contractors and companies for gigs, assignments, submissions, and payout-related features. You
        agree not to misuse the platform, interfere with service operation, or submit fraudulent content.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Gig and Assignment Content</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        You are responsible for any gig details, assignment proof, images, and communications you submit. You must
        have the rights needed for content you upload.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Payments and Rewards</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        Any compensation, stars, credits, or payouts shown in-app are subject to eligibility checks, assignment
        completion requirements, fraud prevention checks, and applicable policies.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Suspension and Termination</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        3D2Y Venture Company may suspend or terminate access for violations of these Terms, abuse, or security risks.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Disclaimers and Liability</SectionTitle>
      <Body style={{ marginBottom: 14 }}>
        The app is provided on an "as is" basis to the extent permitted by law. 3D2Y Venture Company is not liable
        for indirect, incidental, or consequential damages related to use of the platform.
      </Body>

      <SectionTitle style={{ color: theme.colors.text }}>Updates</SectionTitle>
      <Body>
        We may update these Terms from time to time. Continued use of Qlaim after an update means you accept the
        revised Terms.
      </Body>
    </Screen>
  );
}
