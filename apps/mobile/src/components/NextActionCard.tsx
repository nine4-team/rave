import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NextAction } from '../utils/requestDetail';

type NextActionCardProps = {
  action: NextAction;
};

export const NextActionCard: React.FC<NextActionCardProps> = ({ action }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Next</Text>
      <View style={styles.body}>
        <Text style={styles.label}>{action.label}</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{action.message}</Text>
          {action.subtext ? <Text style={styles.subtext}>{action.subtext}</Text> : null}
        </View>
        <View style={styles.actions}>
          {action.actions.map((button) => (
            <Pressable
              key={button.id}
              onPress={button.onPress}
              style={[styles.buttonBase, styles[`button${button.variant}`]]}
            >
              <Text style={[styles.buttonText, styles[`buttonText${button.variant}`]]}>
                {button.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  body: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  messageContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#111111',
  },
  subtext: {
    fontSize: 12,
    color: '#777777',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonprimary: {
    backgroundColor: '#987E55',
  },
  buttonsecondary: {
    backgroundColor: '#F0F0F0',
  },
  buttonghost: {
    backgroundColor: '#F7F7F7',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonTextprimary: {
    color: '#FFFFFF',
  },
  buttonTextsecondary: {
    color: '#333333',
  },
  buttonTextghost: {
    color: '#333333',
  },
});
