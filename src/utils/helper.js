import { ContentType } from '../components/Chat/datamodel/Model'

export function shouldDisplayMessageForType(correntType) {
  let isValid = false;
  for(let key in ContentType.MESSAGE_CONTENT_TYPE) {
    if(ContentType.MESSAGE_CONTENT_TYPE[key] === correntType) {
      isValid = true;
    }
  }
  return isValid;
}