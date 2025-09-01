import Team from "./Team";
import Meet from "./Meet";
import Season from "./Season";
import League from "./League";
import MeetPlan from "./MeetPlan";
import File from "@files/File";
import S from "@src/logo/shapes";
import User from "./User";
import MeetConfirmation from "./MeetConfirmation";

const classMapping = {
  'Season': Season,
  'League': League,
  'Team': Team,
  'Meet': Meet,
  'MeetPlan': MeetPlan,
  'MeetConfirmation': MeetConfirmation,
  'File': File,
  'Logo': S,
  '_User': User
};

export function transformParseObject(parseObject) {
  const JsClass = classMapping[parseObject.className];
  const data = parseObject.toJSON(); // Convert Parse.Object to plain JSON first
  if (JsClass) {
    try {
       return new JsClass(data);
    } catch (mappingError) {
       console.error(`Error mapping ${parseObject.className} object (ID: ${data.objectId}) to JS class:`, mappingError);
       return data;
    }
  } else {
    return data;
  }
}

export function transformParseObjects(parseObjects) {
  return parseObjects.map(parseObject => transformParseObject(parseObject));
}