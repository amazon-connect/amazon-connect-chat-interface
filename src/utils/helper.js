import { ContentType } from "../components/Chat/datamodel/Model";
import { INTERACTIVE_MESSAGE } from "../components/Chat/constants";

export function shouldDisplayMessageForType(correntType) {
  let isValid = false;
  for (let key in ContentType.MESSAGE_CONTENT_TYPE) {
    if (ContentType.MESSAGE_CONTENT_TYPE[key] === correntType) {
      isValid = true;
    }
  }
  return isValid;
}

export function getTimeFromTimeStamp(timeStamp) {
  return new Date(timeStamp).getTime();
}

export function createInteractiveMessagePayload(
  selectedElement,
  preIndex,
  nextIndex,
  listId,
  templateType,
  referenceId
) {
  const payload = { text: selectedElement.title };
  if (
    selectedElement.actionDetail &&
    (selectedElement.actionDetail === INTERACTIVE_MESSAGE.ACTIONS.SHOW_MORE ||
      selectedElement.actionDetail ===
        INTERACTIVE_MESSAGE.ACTIONS.PREVIOUS_OPTIONS)
  ) {
    const requestBody = {
      version: INTERACTIVE_MESSAGE.VERSION,

      data: {
        actionName: selectedElement.actionDetail,
        preIndex,
        nextIndex,
        listId,
        templateType,
        referenceId,
      },
      action: selectedElement.actionDetail,
    };
    const jsonStr = JSON.stringify(requestBody);
    payload.text = jsonStr;
    payload.type = ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_RESPONSE;
  }
  return payload;
}
