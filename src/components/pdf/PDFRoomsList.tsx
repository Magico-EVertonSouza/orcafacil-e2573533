
import { Text, View } from '@react-pdf/renderer';
import { Room } from '@/types';
import { formatNumber } from '@/utils/calculationUtils';
import { styles } from './PDFStyles';

interface PDFRoomsListProps {
  rooms: Room[];
  serviceType: string;
}

const PDFRoomsList = ({ rooms, serviceType }: PDFRoomsListProps) => {
  return (
    <View style={styles.roomsSection}>
      <Text style={styles.roomsSectionTitle}>Detalhes dos Cômodos</Text>
      
      {rooms.map((room, index) => (
        <View style={styles.roomItem} key={`room-${index}`}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomArea}>Área total: {formatNumber(room.totalArea)}m²</Text>
          
          <View style={styles.wallsList}>
            {room.walls.map((wall, wallIndex) => (
              <Text style={styles.wallItem} key={`wall-${wallIndex}`}>
                {serviceType === 'piso' ? `Área ${wallIndex + 1}` : `Parede ${wallIndex + 1}`}: 
                {' '}{formatNumber(wall.width)}m × {formatNumber(wall.height)}m = {formatNumber(wall.area)}m²
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default PDFRoomsList;
