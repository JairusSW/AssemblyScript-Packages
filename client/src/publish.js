const fs = require("fs");

const publish = async (
  options = {
    name: "",
    version: "",
    keywords: "",
    description: "",
    license: "",
    readme: "",
    repository: "",
  }
) => {
  const needle = require("needle");

  const name = options["name"];

  const version = options["version"];

  const keywords = options["keywords"];

  const description = options["description"];

  const license = options["license"];

  const readme = options["readme"].toString("hex");

  const repository = options["repository"];

  const response = await needle(
    "get",
    `https://assemblyscriptpkg.jairussw.repl.co/publish?data=${JSON.stringify({
      name: name,
      version: version,
      keywords: keywords,
      description: description,
      license: license,
      readme: readme,
      repository: repository,
    })}`
  );

  if (response.body === "Package Updated") {
    return true;
  }

  return false;
};

const published = publish({
  name: "as-bitray",
  version: "2.0.8",
  keywords: ["assemblyscript", "binary", "buffer"],
  description: "Small Utility For Handling Binary Data In AssemblyScript",
  license: "MIT",
  readme: fs
    .readFileSync("../../node_modules/as-bitray/README.md")
    .toString("base64"),
  repository: "https://github.com/JairusSW/as-bitray",
});

if (published) console.log("Package Published");
else console.log("Package Declined");
