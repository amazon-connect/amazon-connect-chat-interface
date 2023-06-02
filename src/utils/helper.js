import { ContentType, InteractiveMessageType } from "../components/Chat/datamodel/Model";
import { INTERACTIVE_MESSAGE } from "../components/Chat/constants";
import * as DOMPurify from 'dompurify';

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
  referenceId,
  isCarouselElem = false,
  listTitle,
  carouselTemplateId
) {
  if (isCarouselElem) {
    return {
        text: JSON.stringify({
          templateIdentifier: carouselTemplateId,
          listTitle,
          selectionText: selectedElement.title
        })
    }
  }

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

/**
 * Frontend validations for interactive messages
 *  - Client will always receive a valid template to render
 *  - Frontend will truncate fields
 *  - Upper limits not enforced by backend, beyond a 20k char limit for the entire message
 *
 * Documentation: https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html
 */
export const INTERACTIVE_MESSAGE_CONSTRAINTS = {
  [InteractiveMessageType.PANEL]: {
    titleCharLimit: 400,
    subtitleCharLimit: 400,
    elementsRenderedMax: 10,
    elementTitleCharLimit: 400
  },
  [InteractiveMessageType.LIST_PICKER]: {
    titleCharLimit: 400,
    subtitleCharLimit: 400,
    elementsRenderedMax: 6,
    elementTitleCharLimit: 400,
    elementSubtitleCharLimit: 400,
  },
  [InteractiveMessageType.TIME_PICKER]: {
    titleCharLimit: 400,
    subtitleCharLimit: 400,
  },
  [InteractiveMessageType.CAROUSEL]: {
    titleCharLimit: 400,
    elementsRenderedMax: 5,
  },
  [InteractiveMessageType.QUICK_REPLY]: {
    titleCharLimit: 400,
    elementsRenderedMax: 5,
    replyOptionCharLimit: 200,
  }
}

/**
 * Truncates a string for interactive message based on hard-coded constraints
 *
 * @param {string} str - input string to truncate (e.g. title, subtitle).
 * @param {string} InteractiveMessageType - interactive message templateType.
 * @param {string} fieldLimitKey - field key for contraint (e.g. titleCharLimit).
 * @returns {string} the truncated string.
 */
export const truncateStrFromCharLimit = (str, InteractiveMessageType, fieldLimitKey) => {
  const templateContraints = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType] || {};
  const MAX_LENGTH = templateContraints[fieldLimitKey] || 0;

  if (!(str && typeof str === "string" && MAX_LENGTH)) {
    return "";
  }

  /**
   * Mitigate Interactive Message fields XSS vulnerabilites with `dompurify`
   *
   * React will always render these passed template field values as strings not HTML.
   * React auto-escapes by default unless using dangerouslySetInnerHTML.
   */
  const sanitizedStr = DOMPurify.sanitize(str);

  if (sanitizedStr.length <= MAX_LENGTH) {
    return sanitizedStr;
  } else {
    console.warn(`[${InteractiveMessageType} template] ${fieldLimitKey} of ${MAX_LENGTH} was exceeded`)
    return sanitizedStr.substring(0, MAX_LENGTH) + "...";
  }
}

/**
 * Truncates an array of elements based on the specified minimum and maximum limits.
 *
 * @param {Array} elements - The array of elements to truncate.
 * @param {string} InteractiveMessageType - interactive message templateType.
 * @param {string} elementsRenderedMaxKey - key to retrieve max constraint from INTERACTIVE_MESSAGE_CONSTRAINTS.
 * @returns {Array} The truncated array of elements.
 */
export const truncateElementFromLimit = (elements, InteractiveMessageType, elementsRenderedMaxKey) => {
  const templateContraints = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType] || {};
  const MAX_LIMIT = templateContraints[elementsRenderedMaxKey] || elements.length ;

  if (elements.length > MAX_LIMIT) {
    console.warn(`[${InteractiveMessageType} template] ${elementsRenderedMaxKey} of ${MAX_LIMIT} was exceeded`)
    return elements.slice(0, MAX_LIMIT);
  }

  return elements;
}
