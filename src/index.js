import { ApolloServer } from "apollo-server";
import { UrlLoader } from '@graphql-tools/url-loader';
import { loadSchema } from '@graphql-tools/load';
import { wrapSchema, RenameRootFields, RenameTypes} from "@graphql-tools/wrap";

const [transformSchema] = process.argv.slice(2);

export const getSchema = async () => {
  const schema = await loadSchema("https://api.spacex.land/graphql/", {
    loaders: [new UrlLoader()],
  });

  if (transformSchema === undefined) {
    return schema;
  }

  const transformedSchema = wrapSchema({
    schema,
    transforms: [
      new RenameTypes((name) => `XX_${name}`),
      new RenameRootFields((_operation, name) => `xx_${name}`),
    ],
  });

  return transformedSchema;
};

const startServer = async () => {
  const schema = await getSchema();

  const app = new ApolloServer({
    schema,
    introspection: true,
  });

  const { url } = await app.listen({ port: 4000 });

  console.log(`🚀 Server ready at ${url}`);
};

startServer();