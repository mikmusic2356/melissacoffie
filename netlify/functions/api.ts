import serverless from "serverless-http";
import { app } from "../../src/apiApp";
import { initTursoSchema } from "../../src/db/turso";

let isSchemaInitialized = false;

const serverlessHandler = serverless(app, {
  binary: ["image/*", "video/*", "application/octet-stream"]
});

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!isSchemaInitialized) {
    try {
      await initTursoSchema();
      isSchemaInitialized = true;
    } catch (e: any) {
      console.warn("Turso schema init in serverless warning:", e.message);
    }
  }
  return serverlessHandler(event, context);
};
