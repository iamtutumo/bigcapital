import React from 'react';
import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { FormatDateCell, Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Actions menu.
 */
export function ActionsMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_transaction')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

/**
 * Credit note reconcilation with invoices table columns.
 */
export function useReconcileCreditTransactionsTableColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'formatted_credit_note_date',
        Cell: FormatDateCell,
        width: 100,
        className: 'date',
      },
      {
        Header: intl.get('invoice_no'),
        accessor: 'invoice_number',
        width: 100,
        className: 'invoice_number',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formtted_amount',
        width: 100,
        className: 'amount',
        align: 'right',
      },
    ],
    [],
  );
}
