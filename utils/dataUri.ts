import DataURIParser from "datauri/parser";
interface File {
  originalname: string;
  buffer: any;
  // add any additional properties here
}
import path from "path";
const getDataUri = (file: File) => {
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  console.log(extName);
  return parser.format(extName, file.buffer);
};
export default getDataUri;
