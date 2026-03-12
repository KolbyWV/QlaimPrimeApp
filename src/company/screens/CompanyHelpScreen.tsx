import React from "react";

import { Button, Card, Heading, Screen, SectionTitle } from "../../ui/components";

export function CompanyHelpScreen({ navigation }) {
  return (
    <Screen scroll>
      <Heading>Help</Heading>

      <SectionTitle>Legal</SectionTitle>
      <Card>
        <Button
          label="Terms of Service"
          variant="secondary"
          onPress={() => navigation.navigate("CompanyHelpTermsOfService")}
        />
        <Button
          label="Privacy Policy"
          variant="secondary"
          onPress={() => navigation.navigate("CompanyHelpPrivacyPolicy")}
        />
      </Card>

      <SectionTitle>Support</SectionTitle>
      <Card>
        <Button
          label="Contact Support"
          onPress={() => navigation.navigate("CompanySupport")}
          style={{ marginBottom: 0 }}
        />
      </Card>
    </Screen>
  );
}
