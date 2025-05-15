
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #eaeaea',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginBottom: 15,
    borderBottom: '1 solid #eaeaea',
    paddingBottom: 10,
  },
  serviceHeader: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceDetails: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingBottom: 4,
    backgroundColor: '#eaeaea',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingVertical: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
    padding: 4,
    fontSize: 10,
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
  },
  nameColumn: {
    width: '30%',
  },
  quantityColumn: {
    width: '15%',
    textAlign: 'right',
  },
  unitColumn: {
    width: '15%',
  },
  priceColumn: {
    width: '20%',
    textAlign: 'right',
  },
  subtotalColumn: {
    width: '20%',
    textAlign: 'right',
  },
  serviceTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  serviceTotalText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  serviceTotalValue: {
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: 'bold',
  },
  summaryValue: {
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#bbb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    paddingTop: 10,
  },
  // Estilos para os cômodos
  roomsSection: {
    marginTop: 10,
    marginBottom: 15,
    padding: 5,
  },
  roomsSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomItem: {
    marginBottom: 8,
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  roomName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  roomArea: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  wallsList: {
    paddingLeft: 10,
  },
  wallItem: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  }
});
