import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/SaleReceipt/PageForm.scss';

import ReceiptFrom from './ReceiptForm';
import { ReceiptFormProvider } from './ReceiptFormProvider';

/**
 * Receipt form page.
 */
export default function ReceiptFormPage() {
  const { id } = useParams();

  return (
    <ReceiptFormProvider receiptId={id}>
      <ReceiptFrom />
    </ReceiptFormProvider>
  );
}
