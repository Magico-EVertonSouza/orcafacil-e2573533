
import { StyleSheet } from '@react-pdf/renderer';

export const coverStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#33C3F0',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  brand: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#33C3F0',
    marginBottom: 12,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: '#33C3F0',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  client: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  serviceCount: {
    fontSize: 11,
    color: '#888888',
    marginTop: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 9,
    color: '#AAAAAA',
  },
});

// PDF document styles centralized in one file
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#33C3F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#33C3F0',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E9196',
  },
  section: {
    marginBottom: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EBF8FE',
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#33C3F0',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
  },
  serviceDetails: {
    fontSize: 11,
    color: '#555555',
  },
  table: {
    width: '100%',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
  },
  tableHeader: {
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#444444',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    color: '#333333',
  },
  nameColumn: {
    width: '40%',
  },
  quantityColumn: {
    width: '15%',
    textAlign: 'right',
  },
  unitColumn: {
    width: '15%',
  },
  priceColumn: {
    width: '15%',
    textAlign: 'right',
  },
  subtotalColumn: {
    width: '15%',
    textAlign: 'right',
  },
  serviceTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  serviceTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#444444',
  },
  serviceTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#33C3F0',
  },
  summarySection: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#33C3F0',
    paddingTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222222',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#555555',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#EBF8FE',
    borderLeftWidth: 4,
    borderLeftColor: '#33C3F0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#33C3F0',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 9,
    color: '#AAAAAA',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingTop: 10,
  },
});
