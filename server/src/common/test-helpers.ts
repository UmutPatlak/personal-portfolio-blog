/**
 * Shared Drizzle ORM mock helper for unit tests.
 *
 * Creates a mock that supports arbitrary Drizzle chain patterns like:
 *   db.select().from(table).where(...).orderBy(...).limit(n)
 *   db.insert(table).values({}).returning()
 *   db.update(table).set({}).where(...).returning()
 *   db.delete(table).where(...).returning()
 *
 * Each chain method returns a new Proxy so chains can be arbitrarily deep.
 * The final `await` resolves to the value configured via `_onSelect`, `_onInsert`, etc.
 */
export function buildMockDb() {
  let selectResults: any[] = [[]];
  let insertResults: any[] = [[]];
  let updateResults: any[] = [[]];
  let deleteResults: any[] = [[]];

  let selectIdx = 0;
  let insertIdx = 0;
  let updateIdx = 0;
  let deleteIdx = 0;

  function makeChainable(resolveValue: any): any {
    return new Proxy(
      {},
      {
        get(_t, prop: string) {
          if (prop === 'then') {
            return (res: any) => res(resolveValue);
          }
          // Return a jest.fn that returns another chainable with the same resolve value
          return jest.fn().mockReturnValue(makeChainable(resolveValue));
        },
      },
    );
  }

  const mock = {
    select: jest.fn().mockImplementation(() => {
      const val = selectResults[Math.min(selectIdx, selectResults.length - 1)];
      selectIdx++;
      return makeChainable(val);
    }),
    insert: jest.fn().mockImplementation(() => {
      const val = insertResults[Math.min(insertIdx, insertResults.length - 1)];
      insertIdx++;
      return makeChainable(val);
    }),
    update: jest.fn().mockImplementation(() => {
      const val = updateResults[Math.min(updateIdx, updateResults.length - 1)];
      updateIdx++;
      return makeChainable(val);
    }),
    delete: jest.fn().mockImplementation(() => {
      const val = deleteResults[Math.min(deleteIdx, deleteResults.length - 1)];
      deleteIdx++;
      return makeChainable(val);
    }),
    execute: jest.fn(),

    /** Configure sequential return values for select() chains */
    _onSelect(...results: any[]) {
      selectResults = results;
      selectIdx = 0;
    },
    /** Configure sequential return values for insert() chains */
    _onInsert(...results: any[]) {
      insertResults = results;
      insertIdx = 0;
    },
    /** Configure sequential return values for update() chains */
    _onUpdate(...results: any[]) {
      updateResults = results;
      updateIdx = 0;
    },
    /** Configure sequential return values for delete() chains */
    _onDelete(...results: any[]) {
      deleteResults = results;
      deleteIdx = 0;
    },
  };

  return mock;
}

export type MockDb = ReturnType<typeof buildMockDb>;
