# Scratchpad
First pass at top-level reactive properties

Logic  
Loading status by enum  
Create API wrapper. request data from backend

HTML structure  
Create v-models to tie to form elements

Create child input component. Will contain input validation and value emit

PMT parameter fix: use same units

Rounding totals

style / tailwind deepdive  
change base font. Repo on 3.4. was reading and implementing 4.0 docs.

Fix invalid loan amount NaN results display


## Future nice to haves 
Text input formatAUD mask on blur? 30000 -> $30,000. On focus hide input mask.

Given app is rendering in iframe a resize strategy may be needed:  
postmessage API or [iframe-resizer](https://iframe-resizer.com/) lib.  

Could display info when urlParam ?help to describe resize strategy for parent consumer of iframe. Help curb support requests. 

~~When invalid loan amount display dash in result fields.~~ Done.

Could update native form elements to a more polished UI e.g. [`<input>`](https://ui.shadcn.com/docs/components/input) [`<select>`](https://ui.shadcn.com/docs/components/select)

Form field descriptions hidden behind a small info button.

Update favicon.

Didn't get to Cypress e2e tests. Some Ideas:
* Add cypress test attributes e.g. `data-cy-loan-amount`
* Click clear on loan amount input and;
  * check dash is displayed in results
  * check error message div displayed

Unit test `format-aud.js`. Can probably skip `PMT.js`.