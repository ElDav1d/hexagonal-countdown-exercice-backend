// APPLICATION INDEX
import "reflect-metadata";
import { ExpressApi } from "./adapters/primary/rest/express";
import { MongoManager } from "./adapters/secondary/mongo";
import { MongoExampleRepository } from "./adapters/secondary/mongo/example.repository";
import { MongoCountdownRepository } from "./adapters/secondary/mongo/countdown.repository";
import { install as installSourceMapSupport } from "source-map-support";
import { GoogleWinstonLogger } from "./adapters/secondary/google/logger";
import { GoogleCloudSecret } from "./adapters/secondary/google/secret";
import { GoogleKMS } from "./adapters/secondary/google/kms";
import { GoogleStorage } from "./adapters/secondary/google/storage";
import { PubsubPublisher } from "./adapters/secondary/google/queue";
import { NanoIdGenerator } from "./adapters/secondary/nanoid-generator";
import { AxiosHttp } from "./adapters/secondary/http/axios-http";
import { TrazableAuth } from "./adapters/secondary/trazable/trazable-auth";
import {
  APPLICATION_LOGGER,
  DATABASE_LOGGER,
  EXAMPLE_REPOSITORY,
  COUNTDOWN_REPOSITORY,
  EXPRESS_API_LOGGER,
  ID_GENERATOR,
  PUBSUB_LOGGER,
  QUEUE_PUBLISHER,
  USE_CASES_LOGGER,
} from "./constants";
import { GooglePubSub } from "./adapters/primary/queue/pubsub";
import { Config } from "./config";
import Container from "typedi";

const applicationLogger = new GoogleWinstonLogger(APPLICATION_LOGGER);

async function main() {
  // Source mapping => compiled js
  installSourceMapSupport();

  // DATABASE IDENTIFIERS GENERATOR
  Container.set(ID_GENERATOR, new NanoIdGenerator());

  // QUEUE PUBLISHER
  Container.set(
    QUEUE_PUBLISHER,
    new PubsubPublisher(
      Config.GCLOUD_PROJECT_ID || "",
      new GoogleWinstonLogger(PUBSUB_LOGGER)
    )
  );

  /// //// SECONDARY ADAPTERS (OUTPUT) \\\\ \\\

  // Mongo database configuration
  const mongoClient = await new MongoManager(
    new GoogleCloudSecret(new GoogleKMS(), new GoogleStorage()),
    new GoogleWinstonLogger(DATABASE_LOGGER)
  ).connect();

  // DYNAMIC LOGGER INJECTION FOR EACH LOGGER
  for (const useCaseLogger of Object.keys(USE_CASES_LOGGER)) {
    Container.set(useCaseLogger, new GoogleWinstonLogger(useCaseLogger));
  }

  if (mongoClient) {
    // Repositories
    Container.set(
      EXAMPLE_REPOSITORY,
      new MongoExampleRepository(
        mongoClient,
        new GoogleWinstonLogger(EXAMPLE_REPOSITORY)
      )
    );

    Container.set(
      COUNTDOWN_REPOSITORY,
      new MongoCountdownRepository(
        mongoClient,
        new GoogleWinstonLogger(COUNTDOWN_REPOSITORY)
      )
    );

    /// //// PRIMARY ADAPTERS (INPUT) \\\\ \\\

    // EXPRESS API
    new ExpressApi(
      new GoogleWinstonLogger(EXPRESS_API_LOGGER),
      new TrazableAuth(new AxiosHttp(), Config.AUTH_URL)
    ).start(Config.PORT || "8080");

    // GOOGLE PUBSUB
    new GooglePubSub(
      Config.GCLOUD_PROJECT_ID || "",
      new GoogleWinstonLogger(PUBSUB_LOGGER)
    ).startSubscriptions();
  }
}

main().catch((error) => {
  applicationLogger.error(error);
  process.exit(0);
});
