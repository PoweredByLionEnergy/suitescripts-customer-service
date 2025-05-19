/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/log", "N/email", "N/url", "N/record"], (log, email, url, record) => {
  const afterSubmit = (context) => {
    if (context.type !== "create") return;

    try {
      const newRecord = context.newRecord;

      const isPreCommission = newRecord.getValue({
        fieldId: "custbody_pre_commission",
      });

      if (!isPreCommission) return;

      const loadedRecord = record.load({
        type: record.Type.SALES_ORDER,
        id: newRecord.id,
      });

      let soURL = url.resolveRecord({
        recordType: record.Type.SALES_ORDER,
        recordId: newRecord.id,
        isEditMode: false,
      });

      const tranId = loadedRecord.getValue({ fieldId: "tranid" });

      const subject = `Pre-Commission Sales Order: ${tranId}`;
      const body = `Sales Order ${tranId} has been marked as Pre-Commission. This order needs to be taken to the ESS team to be precommissioned once the order moves into Deposco to be processed. Click <a href="${soURL}">here</a> to view the Sales Order.`;

      email.send({
        author: 4,
        recipients: ["ShippingUT@lionenergy.com", "InventoryUT@lionenergy.com"],
        subject,
        body,
      });

      log.audit("Pre-Commission Notification Sent", `Email sent for ${tranId}`);
    } catch (e) {
      log.error("Error in Pre-Commission Notification", e.message);
    }
  };

  return { afterSubmit };
});
