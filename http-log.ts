import { createApp, Loglevel } from "https://deno.land/x/servest@v1.3.4/mod.ts";
import { copy } from "https://deno.land/std@0.107.0/io/util.ts";
import { cyan } from "https://deno.land/std@0.107.0/fmt/colors.ts";

// HELP
if (Deno.args[0] === "--help") {
  console.log(`
${cyan("Usage:")}
  ${cyan("http-log")} [port]
  `);
  Deno.exit(0);
}

// PROGRAM
const port = parseInt(Deno.args[0]) || 9876;
const app = createApp({ logLevel: Loglevel.NONE, logger: () => {} });

app.handle(/.*/, async (req) => {
  console.log(
    cyan(
      `${new Date().toISOString()} ${req.method} ${req.path}`,
    ),
  );

  await copy(req.body, Deno.stdout);
  console.log();

  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/plain",
    }),
    body: "Ok",
  });
});

app.listen({ port });
console.log(`Listening on :${port}`);
