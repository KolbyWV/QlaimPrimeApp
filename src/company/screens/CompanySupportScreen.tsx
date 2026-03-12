import React, { useMemo, useState } from "react";
import { Alert, Linking, Text } from "react-native";

import { useSession } from "../../auth/session";
import { Body, Button, Card, Field, Heading, Screen } from "../../ui/components";
import { useAppTheme } from "../../ui/theme";

const SUPPORT_EMAIL = "support@qlaim.dev";

export function CompanySupportScreen() {
  const { theme } = useAppTheme();
  const { me } = useSession();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const fromEmail = me?.email || "unknown";

  const canSend = useMemo(() => subject.trim().length > 0 && details.trim().length > 0, [details, subject]);

  async function openSupportDraft() {
    if (!canSend || sending) return;

    try {
      setSending(true);
      const bodyLines = [
        `From account: ${fromEmail}`,
        "",
        "Issue details:",
        details.trim(),
      ];
      const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert("Unable to open email app", "Please email support@qlaim.dev from your preferred email app.");
        return;
      }

      await Linking.openURL(url);
      Alert.alert("Draft created", "Your support ticket draft is ready to send to support@qlaim.dev.");
    } catch (_error) {
      Alert.alert("Unable to start support email", "Please email support@qlaim.dev and include your issue details.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen scroll contentStyle={{ paddingBottom: 36 }}>
      <Heading>Contact Support</Heading>
      <Body style={{ marginBottom: 16 }}>
        Send a support ticket to support@qlaim.dev. Fill out the form below and we will open your email draft.
      </Body>

      <Card>
        <Text style={{ color: theme.colors.textMuted, marginBottom: 12 }}>
          Sending as: {fromEmail}
        </Text>
        <Field
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          placeholder="Short summary of the issue"
          autoCapitalize="sentences"
        />
        <Field
          label="Details"
          value={details}
          onChangeText={setDetails}
          placeholder="Describe what happened and how we can help."
          autoCapitalize="sentences"
          multiline
          numberOfLines={6}
          style={{ minHeight: 130, textAlignVertical: "top" }}
        />
        <Button
          label={sending ? "Opening email..." : "Send Support Ticket"}
          loading={sending}
          disabled={!canSend}
          onPress={openSupportDraft}
          style={{ marginBottom: 0 }}
        />
      </Card>
    </Screen>
  );
}
