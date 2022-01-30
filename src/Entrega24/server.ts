import { printArgs } from "./utils.ts";
import { createApp, contentTypeFilter } from "https://deno.land/x/servest@v1.3.1/mod.ts";

const colors = [...Deno.args]

const app = createApp();
app.get("/", async (req) => {
  const colores = {colores: colors}
  await req.respond({ 
    status: 200,
    headers: new Headers({ 
      "Content-Type": "application/json"
    }),
    body: JSON.stringify(colores)
  })
});

app.post("/", contentTypeFilter("application/json"), async (req) => {
  const bodyJson = (await req.json()) as { color: string };
  const color: string = bodyJson.color;
  printArgs([color]);
  colors.push(color);
  await req.respond({ 
    status: 200,
    headers: new Headers({ 
      "Content-Type": "text/plain"
    }),
    body: `Se agrego ${color} a los colores`
  })
 
});

app.listen({port: 3000});
printArgs(colors);