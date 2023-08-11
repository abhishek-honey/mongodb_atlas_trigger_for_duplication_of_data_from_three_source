exports = async function(changeEvent) {
    // A Database Trigger will always call a function with a changeEvent.
    // Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/
  
    // This sample function will listen for events and replicate them to a collection in a different Database
  
    // Logging the change event, there is no need to log the event, but the team can keep this for historical purpose or for debugging.
    console.log("duplicate_data_from_source_3_to_target: changeEvent: ", JSON.stringify(changeEvent));
    
    // Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;
  
    // Get the MongoDB service you want to use (see "Linked Data Sources" tab)
    // Note: In Atlas Triggers, the service name is defaulted to the cluster name.
    const serviceName = "Cluster1";
    const database = "trigger";
    const target= "target"
    const collection = context.services.get(serviceName).db(database).collection(target);
  
    // Get the "FullDocument" present in the Insert/Replace/Update ChangeEvents
    try {
      // If this is a "delete" event, delete the document in the other collection
      if (changeEvent.operationType === "delete") {
        await collection.deleteOne({"_id": docId});
      }
  
      // If this is an "insert" event, insert the document into the other collection
      else if (changeEvent.operationType === "insert") {
        await collection.insertOne(changeEvent.fullDocument);
      }
  
      // If this is an "update" or "replace" event, then replace the document in the other collection
      else if (changeEvent.operationType === "update" || changeEvent.operationType === "replace") {
        await collection.replaceOne({"_id": docId}, changeEvent.fullDocument);
      }
    } catch(err) {
      console.log("duplicate_data_from_source_3_to_target: error performing mongodb write: ", err.message);
    }
  };