// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { IntlProvider } from 'react-intl';
import { LANGUAGES } from '../constants/global';
import { AmazonConnectChatInterfaceStrings } from '../localization';
//Context
export const LanguageContext = React.createContext();

//Provider
export class LanguageProvider extends React.Component {

    constructor(props) {
        super(props);
        const selectedLanguage = this.getLanguageDetails("en_US");
        this.state = {
            selectedLanguage,
            messages: {}
        };
        this.loadLanguages(selectedLanguage);
    }

    getLanguageDetails = (language) => {
        return LANGUAGES.find(function (lan) {
            return lan.id === language;
        });
    };

    loadLanguages = (selectedLanguage) => {
        const selectedLanguageId = selectedLanguage ? selectedLanguage.id : this.state.selectedLanguage.id;
        if (this.state.selectedLanguage.id !== selectedLanguageId) {
            this.setState({
                messages: {...(AmazonConnectChatInterfaceStrings[selectedLanguageId] || {})},
                selectedLanguage,
            });
        }
    };

    changeLanguage = (language) => {
        const selectedLanguage = this.getLanguageDetails(language);
        if (!!selectedLanguage) {
            this.loadLanguages(selectedLanguage);
        }
        try {
            const logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-Chat" });
            logger.warn("selected language:", language, selectedLanguage);
        } catch(err) {
            console.info("Error logging language change using LogManager", err);
        }
    };

    render() {
        return (
            <LanguageContext.Provider value={{
                selectedLanguage: this.state.selectedLanguage,
                changeLanguage: this.changeLanguage
            }}>
                <IntlProvider
                    locale={this.state.selectedLanguage.value}
                    key={this.state.selectedLanguage.value}
                    messages={this.state.messages}>
                    {this.props.children}
                </IntlProvider>
            </LanguageContext.Provider>
        )
    };
};

export default LanguageContext;