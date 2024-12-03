import React, { useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Tooltip({ children, text }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [childrenLayout, setChildrenLayout] = useState(null);

  const showTooltip = (event) => {
    const { pageX, pageY, width: elementWidth, height: elementHeight } = event.nativeEvent;
    setTooltipPosition({
      x: pageX - (120 / 2) + (elementWidth / 2), // Center tooltip horizontally
      y: pageY - elementHeight - 10, // Position above the element
    });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const measureChildren = (event) => {
    setChildrenLayout({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  return (
    <>
      <TouchableWithoutFeedback 
        onPress={showTooltip}
        onLongPress={showTooltip}
        delayLongPress={500}
      >
        <View onLayout={measureChildren}>
          {children}
        </View>
      </TouchableWithoutFeedback>

      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <TouchableWithoutFeedback onPress={hideTooltip}>
          <View style={styles.modalOverlay}>
            <View 
              style={[
                styles.tooltipContainer,
                {
                  left: tooltipPosition.x,
                  top: tooltipPosition.y,
                }
              ]}
            >
              <Text style={styles.tooltipText}>{text}</Text>
              <View style={styles.arrow} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tooltipContainer: {
    position: 'absolute',
    width: 120,
    backgroundColor: '#555',
    borderRadius: 6,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -5,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderTopColor: '#555',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});