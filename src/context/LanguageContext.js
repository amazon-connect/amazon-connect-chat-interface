// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import messages_en from '../localization/en_US.json';
import messages_fr from '../localization/fr_FR.json';
import { addLocaleData, IntlProvider } from 'react-intl';
import { LANGUAGE_KEY, LANGUAGES } from '../constants/global';

// add for all languages
export const labels = {
  en_US: messages_en,
  fr_FR: messages_fr
}

//Context
const LanguageContext = React.createContext(labels.en);

//Provider
export class LanguageProvider extends React.Component {

  constructor(props) {
    super(props);
    console.log("LanguageProvider called...", props);
    this.state = {
      selectedLanguage: this.getLanguageDetails(localStorage.getItem(LANGUAGE_KEY)) || this.getLanguageDetails("en_US")
    };
    this.loadLanguages();
  }

  getLanguageDetails = (language) => {
    return LANGUAGES.find(function (lan) {
      return lan.id === language;
    });
  }

  loadLanguages = () => {
    let elLocaleData = require('react-intl/locale-data/en');
    addLocaleData(elLocaleData);
  }

  changeLanguage = (languageObject) => {
    this.setState({ selectedLanguage: languageObject });
    console.log(languageObject);
    this.loadLanguages();
    localStorage.setItem(LANGUAGE_KEY, languageObject.id);
  };

  render() {
    return (
      <LanguageContext.Provider value={{
        selectedLanguage: this.state.selectedLanguage,
        onLanguageChange: this.changeLanguage
      }}>
        <IntlProvider
          locale={this.state.selectedLanguage.value}
          messages={labels[this.state.selectedLanguage.id]}>
          {this.props.children}
        </IntlProvider>
      </LanguageContext.Provider>
    )
  };
};

export default LanguageContext;