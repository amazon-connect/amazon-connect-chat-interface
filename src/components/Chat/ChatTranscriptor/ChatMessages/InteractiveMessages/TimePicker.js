// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
 
import React, { useState } from "react";
import PT from "prop-types";
import { Button } from "connect-core";
import styled from "styled-components";
import {
  TextSection,
  ResponsesSection,
  Title,
  Subtitle
} from "../InteractiveMessage";
 
const NUM_TIMESLOTS_PER_PAGE = 3;
 
const DatePicker = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.globals.basePadding};
  
  span {
    padding: 0 5px;
    flex-grow: 2;
  }
`;
 
const DatePickerButton = styled(Button)`
  border: ${({ theme }) => theme.globals.baseBorder};
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &[disabled] {
    opacity: 0.3 !important;
  }
  
  &>div {
    display: flex;
  }
`;
 
DatePicker.PrevDateButton = styled(DatePickerButton)`
  align-self: flex-start;
`;
 
DatePicker.NextDateButton = styled(DatePickerButton)`
  align-self: flex-end;
`;
 
const ChevronIcon = styled.div`
  font-size: 0;
  transform: rotate(${props => props.direction === "left" ? "180" : "0"}deg);
  
  svg {
    width: 8px;
    height: 12px;
  }
`;
 
const TimeslotsList = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.large};
  
  button {
    margin-top: ${({ theme }) => theme.globals.basePadding};
    width: 100%;
    max-width: none;
    border-radius: ${({ theme }) => theme.spacing.mini};
    white-space: pre-line;
    
    &[data-selected='true'] { 
      box-shadow: none;
      border: 1px solid ${({ theme }) => theme.color.highlightColor};
    }
  }
`;
 
 
const TimeslotControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.globals.basePadding} ${({theme }) => theme.spacing.large };
  
  button{
      border-radius: ${({ theme }) => theme.spacing.mini};
	  padding: ${({ theme }) => theme.globals.basePadding};
	     
	  &[disabled] {
	    opacity: 0.3 !important;
	  }
  }
`;
 
const PrevTimeslotsButton = styled.button`
  background-color: #fff;
  align-self: flex-start;
`;
 
const NextTimeslotsButton = styled.button`
  background-color: #fff;
  align-self: flex-end;
`;
 
 
const ConfirmControlsButton = styled.button`
  background-color: #3F5773;
  color: #fff !important;
`;
 
const ConfirmSelectionButton = styled(ConfirmControlsButton)`
  flex-grow: 2;
`;
const ResetSelectionButton = styled(ConfirmControlsButton)`
  font-size: 0;
  margin-right: ${({theme}) => theme.spacing.mini};
  svg {
    width: ${({theme}) => theme.fontsSize.small};
    height: ${({theme}) => theme.fontsSize.small};
  }
`;
 
function getLocale(){
  return (navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : navigator.language) || 'en-US';
}
 
function TimeslotButton({timeslot, timezoneOffset, onClick, onKeyPress, selected }) {
    const { date } = timeslot;
    const parsedDate = new Date(date);
    const start = parsedDate.toLocaleTimeString(
      `${getLocale()}`,
      {
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short"
      }
    );
 
    return (
        <Button selected={selected} value={date} onKeyPress={onKeyPress} onClick={onClick}>
            {`${start}` }
        </Button>
    );
}
 
TimePicker.propTypes = {
  content: PT.object.isRequired,
  addMessage: PT.func.isRequired
};
 
function Chevron({ direction }){
  return (
    <ChevronIcon direction={direction}>
      <svg width="8px" height="12px" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg">
        <title>Path</title>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <polygon id="Path" fill="currentColor" fillRule="nonzero" points="2 0 0.59 1.41 5.17 6 0.59 10.59 2 12 8 6"></polygon>
        </g>
      </svg>
    </ChevronIcon>
  )
}
 
export default function TimePicker({ content, addMessage }) {
  const { title, subtitle, timezoneOffset, timeslots } = content;
 
  const timeslotsGroupedByDate = getTimeslotsGroupedByDate(timeslots);
  const availableDates = Object.keys(timeslotsGroupedByDate);
 
  const [datePageIndex, setDatePageIndex] = useState(0);
  const selectedDate = availableDates[datePageIndex];
  const timeslotsForSelectedDate = timeslotsGroupedByDate[selectedDate];
 
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [timeslotPageIndex, setTimeslotPageIndex] = useState(0);
  const timeslotStartIndex = timeslotPageIndex * NUM_TIMESLOTS_PER_PAGE;
  const timeslotNextPageStartIndex = timeslotStartIndex + NUM_TIMESLOTS_PER_PAGE;
  const visibleTimeslotsForSelectedDate = timeslotsForSelectedDate.slice(timeslotStartIndex, Math.min(timeslotsForSelectedDate.length, timeslotNextPageStartIndex));
 
  function showEarlierDate() {
    changeDate(datePageIndex - 1);
  }
 
  function showLaterDate() {
    changeDate(datePageIndex + 1);
  }
 
  function changeDate(pageIndex) {
    setDatePageIndex(pageIndex);
    setTimeslotPageIndex(0);
    setSelectedTimeslot(null);
  }
 
  function showEarlierTimeslots() {
    setTimeslotPageIndex(timeslotPageIndex - 1);
  }
 
  function showLaterTimeslots() {
    setTimeslotPageIndex(timeslotPageIndex + 1);
  }
 
  function onTimeslotSelect(e) {
    setSelectedTimeslot(e.currentTarget.value);
  }
 
  function resetSelection(){
    setSelectedTimeslot(null);
  }
 
  function confirmSelection() {
    addMessage({ text: selectedTimeslot });
  }
 
  function renderTimeslot(timeslot) {
    const selected = new Date(selectedTimeslot).getTime() === new Date(timeslot.date).getTime();
    return <TimeslotButton selected={selected} key={`timeslot${timeslot.date}`} timeslot={timeslot} timezoneOffset={timezoneOffset} onKeypress={onTimeslotSelect} onClick={onTimeslotSelect}/>;
  }
 
  const dateString = new Date(selectedDate).toLocaleDateString(getLocale(),
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  const showDateControls = availableDates.length > 0;
  const showTimeslotPaginationButtons = selectedTimeslot == null && timeslotsForSelectedDate.length > NUM_TIMESLOTS_PER_PAGE;
 
  return (
    <>
      <TextSection>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TextSection>
      <ResponsesSection>
        <DatePicker>
          {showDateControls &&
          <DatePicker.PrevDateButton disabled={datePageIndex === 0} onKeyPress={showEarlierDate} onClick={showEarlierDate} data-testid={`time-picker-prev-date-button`}>
            <Chevron direction={"left"}/>
          </DatePicker.PrevDateButton>}
          <span>{dateString}</span>
          {showDateControls &&
          <DatePicker.NextDateButton disabled={datePageIndex === availableDates.length - 1} onClick={showLaterDate} data-testid={`time-picker-next-date-button`}>
            <Chevron direction={"right"}/>
          </DatePicker.NextDateButton>}
        </DatePicker>
        <TimeslotsList>
          {visibleTimeslotsForSelectedDate.map(renderTimeslot)}
        </TimeslotsList>
        <TimeslotControls>
          {selectedTimeslot != null &&
          <>
            <ResetSelectionButton onClick={resetSelection} data-testid={`time-picker-reset-selection-button`}>
              <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M13 1.3L11.7 0 6.5 5.2 1.3 0 0 1.3l5.2 5.2L0 11.7 1.3 13l5.2-5.2 5.2 5.2 1.3-1.3-5.2-5.2z" fillRule="evenodd"/>
              </svg>
            </ResetSelectionButton>
            <ConfirmSelectionButton disabled={selectedTimeslot == null} onClick={confirmSelection} data-testid={`time-picker-confirm-selection-button`}>Confirm</ConfirmSelectionButton>
          </>}
            {showTimeslotPaginationButtons &&
            <>
            <PrevTimeslotsButton disabled={timeslotPageIndex === 0}
                                 onClick={showEarlierTimeslots}>Earlier</PrevTimeslotsButton>
            <NextTimeslotsButton disabled={timeslotNextPageStartIndex >= timeslotsForSelectedDate.length}
                  onClick={showLaterTimeslots}>Later</NextTimeslotsButton>
            </>}
        </TimeslotControls>
      </ResponsesSection>
    </>
  );
}
 
function getTimeslotsGroupedByDate(timeslots){
  //iso dates are lexicographically sortable, may hve to switch to comparing by date objects though
  timeslots.sort((a, b) => a.date.localeCompare(b.date));
  return timeslots.reduce((slotMap, slot) => {
    const msToMidnightOfDate = new Date(slot.date).setHours(0, 0, 0, 0);
    const dateKey = new Date(msToMidnightOfDate).toDateString();
    if(!slotMap[dateKey]){
      slotMap[dateKey] = [];
    }
    slotMap[dateKey].push(slot)
    return slotMap;
  }, {});
}