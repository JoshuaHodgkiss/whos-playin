import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value?: string | null;
  placeholder?: string;
  onChange?: (value: string) => void;
  style?: any;
};

export function Dropdown({ options, value = null, placeholder = 'Select', onChange, style }: DropdownProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View style={[styles.wrapper, style]}> 
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.button}>
        <ThemedText>{selected ? selected.label : placeholder}</ThemedText>
      </TouchableOpacity>

      <Modal transparent style={{  }} visible={open} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.menu} onPress={() => {}}>
            <FlatList
              data={options}              
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setOpen(false);
                    onChange && onChange(item.value);
                  }}
                >
                  <ThemedText>{item.label}</ThemedText>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: '80%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    top:-245,
    width: '90%',
    maxHeight: '60%',
    backgroundColor: '#353636',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 6,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Dropdown;
