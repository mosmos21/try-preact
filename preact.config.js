import path from "path"

export default config => {
  config.resolve.alias["~"] = path.resolve(__dirname, "src");

  return config;
}
