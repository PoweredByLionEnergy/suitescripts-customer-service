/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/log"], (record, log) => {
  /**
   * Defines the User Event `beforeSubmit` entry point.
   * @param {Object} context - Script context.
   */
  // const TARGET_CUSTOMER_ID = "7";
  const CLEAR_CHECKBOXES = ["custbody_sample_order", "custbody_demo_order"];

  const beforeSubmit = (context) => {
    log.debug("Script Start", "User Event triggered");

    if (
      context.type !== context.UserEventType.CREATE &&
      context.type !== context.UserEventType.EDIT
    ) {
      log.debug("Not create or edit");
      return;
    }

    const salesOrder = context.newRecord;
    // const customerId = salesOrder.getValue({ fieldId: "entity" });

    // if (customerId != TARGET_CUSTOMER_ID) {
    //   log.debug("Not test customer");
    //   return;
    // }

    const shouldClear = CLEAR_CHECKBOXES.some((fieldId) =>
      salesOrder.getValue({ fieldId })
    );

    if (!shouldClear) {
      log.debug("Dont clear order", "Dont clear order");
      return;
    }

    salesOrder.setValue({
      fieldId: "custbody_free_shipping",
      value: true,
    });

    const lineCount = salesOrder.getLineCount({ sublistId: "item" });

    for (let i = 0; i < lineCount; i++) {
      salesOrder.setSublistValue({
        sublistId: "item",
        fieldId: "rate",
        line: i,
        value: 0,
      });

      salesOrder.setSublistValue({
        sublistId: "item",
        fieldId: "amount",
        line: i,
        value: 0,
      });
    }

    log.debug("Sales Order", `Line items cleared for customer ID `);
  };

  return { beforeSubmit: beforeSubmit };
});
