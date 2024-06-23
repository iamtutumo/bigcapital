import { Inject, Service } from 'typedi';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionsFilter } from './types';

@Service()
export class GetMatchedTransactionsByManualJournals extends GetMatchedTransactionsByType {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the matched transactions of manual journals.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: Omit<GetMatchedTransactionsFilter, 'transactionType'>
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query().onBuild((query) => {
      query.whereNotExists(
        ManualJournal.relatedQuery('matchedBankTransaction')
      );
      if (filter.fromDate) {
        query.where('date', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        query.where('date', '<=', filter.toDate);
      }
      if (filter.minAmount) {
        query.where('amount', '>=', filter.minAmount);
      }
      if (filter.maxAmount) {
        query.where('amount', '<=', filter.maxAmount);
      }
    });
    return this.transformer.transform(
      tenantId,
      manualJournals,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }

  /**
   * Retrieves the matched transaction of manual journals.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  async getMatchedTransaction(tenantId: number, transactionId: number) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournal = await ManualJournal.query()
      .findById(transactionId)
      .whereNotExists(ManualJournal.relatedQuery('matchedBankTransaction'))
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      manualJournal,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }
}
