import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Card, 
  Text, 
  IconButton, 
  Chip, 
  useTheme,
  TouchableRipple,
} from 'react-native-paper';
import { format, differenceInDays } from 'date-fns';
import { PantryItem as PantryItemType } from '@/hooks/api/usePantryItems';

interface PantryItemProps {
  item: PantryItemType;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showExpiryWarning?: boolean;
  showLowStockWarning?: boolean;
}

export const PantryItem: React.FC<PantryItemProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  showExpiryWarning,
  showLowStockWarning,
}) => {
  const theme = useTheme();
  
  const getExpiryStatus = () => {
    if (!item.expiryDate) return null;
    const daysUntilExpiry = differenceInDays(new Date(item.expiryDate), new Date());
    
    if (daysUntilExpiry < 0) {
      return { text: 'Expired', color: theme.colors.error };
    } else if (daysUntilExpiry <= 3) {
      return { text: `${daysUntilExpiry} days left`, color: theme.colors.error };
    } else if (daysUntilExpiry <= 7) {
      return { text: `${daysUntilExpiry} days left`, color: '#FFA500' };
    }
    return null;
  };

  const expiryStatus = getExpiryStatus();
  const isLowStock = item.lowStockThreshold && item.quantity <= item.lowStockThreshold;

  return (
    <Card style={styles.card} elevation={1}>
      <TouchableRipple onPress={onPress} style={styles.touchable}>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text variant="titleMedium" style={styles.name}>
                {item.name}
              </Text>
              {item.gratitudeNote && (
                <Text variant="bodySmall" style={styles.gratitude}>
                  🙏 {item.gratitudeNote}
                </Text>
              )}
            </View>
            
            <View style={styles.details}>
              <Text variant="bodyMedium" style={styles.quantity}>
                {item.quantity} {item.unit}
              </Text>
              
              <View style={styles.chips}>
                <Chip 
                  compact 
                  mode="flat" 
                  style={[styles.categoryChip, { backgroundColor: theme.colors.secondaryContainer }]}
                >
                  {item.category}
                </Chip>
                
                {expiryStatus && (
                  <Chip 
                    compact 
                    mode="flat" 
                    style={[styles.statusChip, { backgroundColor: expiryStatus.color + '20' }]}
                    textStyle={{ color: expiryStatus.color }}
                  >
                    {expiryStatus.text}
                  </Chip>
                )}
                
                {isLowStock && (
                  <Chip 
                    compact 
                    mode="flat" 
                    style={[styles.statusChip, { backgroundColor: '#FFA50020' }]}
                    textStyle={{ color: '#FFA500' }}
                  >
                    Low stock
                  </Chip>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={onEdit}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={onDelete}
              style={styles.actionButton}
            />
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontWeight: '600',
  },
  gratitude: {
    marginTop: 4,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantity: {
    marginRight: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
});