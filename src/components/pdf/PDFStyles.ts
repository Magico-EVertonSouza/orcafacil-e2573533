
import { StyleSheet } from '@react-pdf/renderer';

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
    borderBottomWidth: 1,
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
    backgroundColor: '#F1F1F1',
    padding: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceDetails: {
    fontSize: 12,
  },
  table: {
    width: '100%',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F7',
  },
  tableHeader: {
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
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
    padding: 5,
  },
  serviceTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  serviceTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#33C3F0',
    paddingTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    padding: 10,
    backgroundColor: '#F1F1F1',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#8E9196',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingTop: 10,
  },
});
