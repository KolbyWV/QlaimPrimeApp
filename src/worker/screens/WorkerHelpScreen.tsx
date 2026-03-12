import React from "react";

import { Button, Card, Heading, Screen, SectionTitle } from "../../ui/components";

export function WorkerHelpScreen({ navigation }) {
  return (
    <Screen scroll>
      <Heading>Help</Heading>

      <SectionTitle>Legal</SectionTitle>
      <Card>
        <Button
          label="Terms of Service"
          variant="secondary"
          onPress={() => navigation.navigate("HelpTermsOfService")}
        />
        <Button
          label="Privacy Policy"
          variant="secondary"
          onPress={() => navigation.navigate("HelpPrivacyPolicy")}
        />
      </Card>

      <SectionTitle>Support</SectionTitle>
      <Card>
        <Button
          label="Contact Support"
          onPress={() => navigation.navigate("Support")}
          style={{ marginBottom: 0 }}
        />
      </Card>
    </Screen>
  );
}
