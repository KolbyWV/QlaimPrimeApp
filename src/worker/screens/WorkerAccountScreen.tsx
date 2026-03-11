import React, { useCallback, useState } from "react";
import { Alert, Text } from "react-native";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFocusEffect } from "@react-navigation/native";

import { useSession } from "../../auth/session";
import {
  DELETE_PROFILE_MUTATION,
  MY_MONEY_TRANSACTIONS_QUERY,
} from "../../graphql/domain";
import { Button, Card, Heading, Screen, SectionTitle } from "../../ui/components";
import { UserSummaryCard } from "../../ui/domain";
import { useAppTheme } from "../../ui/theme";

function calculateMoneyBalance(transactions) {
  return (transactions || []).reduce((total, tx) => total + (tx?.amountCents || 0), 0);
}

export function WorkerAccountScreen({ navigation }) {
  const { theme, themeMode, toggleThemeMode } = useAppTheme();
  const { me, switchMode, signOut, refreshMe } = useSession();
  const [accountError, setAccountError] = useState(null);
  const { data: moneyData, error: moneyError } = useQuery(MY_MONEY_TRANSACTIONS_QUERY, {
    variables: { limit: 100, offset: 0 },
  });
  const [deleteProfile, { loading: deletingAccount }] = useMutation(DELETE_PROFILE_MUTATION);

  const balanceCents = calculateMoneyBalance(moneyData?.myMoneyTransactions);
  const canAccessAdmin = me?.role === "ADMIN";

  useFocusEffect(
    useCallback(() => {
      refreshMe().catch(() => {
        // Ignore focus-refresh failures; the screen can still render cached session data.
      });
    }, [refreshMe]),
  );

  const confirmDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete account permanently?",
      "This is permanent and cannot be undone. All account data and access will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              setAccountError(null);
              await deleteProfile();
              await signOut();
            } catch (nextError) {
              setAccountError(nextError?.message || "Unable to delete account right now.");
            }
          },
        },
      ],
    );
  }, [deleteProfile, signOut]);

  return (
    <Screen hideBack scroll contentStyle={{ paddingBottom: 130 }}>
      <Heading style={{ fontSize: 32, marginBottom: 10 }}>PROFILE</Heading>

      <UserSummaryCard
        name={`${me?.profile?.firstName || ""} ${me?.profile?.lastName || ""}`.trim() || me?.email || "Profile"}
        username={me?.profile?.username || "username"}
        avatarUrl={me?.profile?.avatarUrl || ""}
        tier={me?.profile?.tier || "COPPER"}
        starsBalance={me?.profile?.starsBalance || 0}
        gigCount={me?.assignments?.length || 0}
        ratingAvg={me?.profile?.ratingAvg ?? 5}
        moneyBalanceCents={balanceCents}
      />

      {moneyError ? <Text style={{ color: theme.colors.danger, marginBottom: 8 }}>{moneyError.message}</Text> : null}

      <SectionTitle>Account actions</SectionTitle>
      <Card>
        <Button
          label="Update Profile"
          variant="secondary"
          onPress={() => navigation.navigate("UpdateProfile")}
        />
        <Button
          label="Gig History"
          variant="secondary"
          onPress={() => navigation.navigate("PastAssignments")}
        />
        <Button
          label="Transactions"
          variant="secondary"
          onPress={() => navigation.navigate("Transactions")}
        />
        <Button label="Switch to Company Mode" onPress={() => switchMode("company")} />
        {canAccessAdmin ? (
          <Button label="Switch to Admin Mode" variant="secondary" onPress={() => switchMode("admin")} />
        ) : null}
        <Button
          label={themeMode === "dark" ? "Use Light Theme" : "Use Dark Theme"}
          variant="secondary"
          onPress={toggleThemeMode}
        />
        <Button
          label={deletingAccount ? "Deleting account..." : "Delete Account"}
          variant="destructive"
          disabled={deletingAccount}
          loading={deletingAccount}
          onPress={confirmDeleteAccount}
        />
        <Button label="Sign out" variant="destructive" onPress={signOut} style={{ marginBottom: 0 }} />
        {accountError ? <Text style={{ color: theme.colors.danger, marginBottom: 8 }}>{accountError}</Text> : null}
      </Card>
    </Screen>
  );
}
